import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { KeyboardGestureArea } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { color, semantic, radius, hit } from '@common/shared';
import type { MessageData, MessageListResponse } from '@common/shared';
import useGetMemberships from '../../hooks/api/membership/useGetMemberships';
import useGetRoomMessages from '../../hooks/api/room/useGetRoomMessages';
import useComposeBarKeyboard, { COMPOSE_BAR_HEIGHT } from '../../hooks/keyboard/useComposeBarKeyboard';
import { presignPhotoUpload } from '../../hooks/api/room/usePresignPhotoUpload';
import { getSocket } from '../../libs/socket';
import { QUERY_KEYS } from '../../constant/queryKeys';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import type { RootStackParamList } from '../../router';
import { dayKey } from '../Chat/chatDisplay';
import MessageBubble from '../Chat/MessageBubble';
import ComposeBar, { type SelectedPhoto } from '../Chat/ComposeBar';

type SendAck = { error?: string; data?: MessageData };
type HideAck = { error?: string };

const ChatRoom = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'ChatRoom'>>();
  const { welfareId, roomId, roomTitle } = params;

  const queryClient = useQueryClient();
  const queryKey = [QUERY_KEYS.MESSAGES, welfareId, roomId];

  const { data: membershipsData } = useGetMemberships();
  const myUserId = (membershipsData?.data ?? []).find(m => m.welfare._id === welfareId)?.userId ?? '';

  const { data: messagesData } = useGetRoomMessages(welfareId, roomId);
  const messages = messagesData?.data.messages ?? [];
  const canSend = messagesData?.data.canSend ?? false;
  const canManage = messagesData?.data.canManage ?? false;

  const [draft, setDraft] = useState('');
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  /** 사진 업로드가 아직 안 끝난 낙관적 메시지의 clientMessageId 집합(스피너 표시용) */
  const [uploadingMessageIds, setUploadingMessageIds] = useState<Set<string>>(new Set());
  /** 사진 업로드에 실패한 낙관적 메시지의 clientMessageId 집합(X 표시용) */
  const [failedMessageIds, setFailedMessageIds] = useState<Set<string>>(new Set());

  const { insets, renderScrollComponent, onComposeBarLayout } = useComposeBarKeyboard();

  /** 소켓 join_room/leave_room, 신규 메시지·가리기 브로드캐스트 수신. 45. 이야기방 실시간 채팅 참고. */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('join_room', { roomId }, (response: { error?: string }) => {
      if (response?.error) {
        Alert.alert('안내', response.error);
        navigation.goBack();
      }
    });

    /**
     * clientMessageId로 도착 순서와 무관하게 dedup(ack가 먼저 올 수도, 이 브로드캐스트가 먼저 올 수도 있음).
     * 45. 이야기방 실시간 채팅 참고.
     */
    const handleNewMessage = ({ message, clientMessageId }: { message: MessageData; clientMessageId: string | null }) => {
      queryClient.setQueryData<MessageListResponse>(queryKey, old => {
        if (!old) return old;
        if (old.data.messages.some(m => m._id === message._id)) return old;

        if (clientMessageId && old.data.messages.some(m => m._id === clientMessageId)) {
          return { ...old, data: { ...old.data, messages: old.data.messages.map(m => (m._id === clientMessageId ? message : m)) } };
        }

        return { ...old, data: { ...old.data, messages: [message, ...old.data.messages] } };
      });
    };

    const handleMessageHidden = ({ messageId }: { messageId: string }) => {
      queryClient.setQueryData<MessageListResponse>(queryKey, old => {
        if (!old) return old;
        return {
          ...old,
          data: { ...old.data, messages: old.data.messages.map(m => (m._id === messageId ? { ...m, hidden: true } : m)) },
        };
      });
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_hidden', handleMessageHidden);

    return () => {
      socket.emit('leave_room', { roomId });
      socket.off('new_message', handleNewMessage);
      socket.off('message_hidden', handleMessageHidden);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  /** 사진 하나를 presigned URL로 S3에 업로드. 46. 메시지 사진 첨부 참고. */
  const uploadPhoto = async (photo: SelectedPhoto): Promise<string> => {
    const presignRes = await presignPhotoUpload(welfareId, roomId, photo.contentType);
    const { uploadUrl, publicUrl } = presignRes.data;
    const fileBlob = await (await fetch(photo.uri)).blob();
    const uploadRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': photo.contentType }, body: fileBlob });
    if (!uploadRes.ok) {
      const body = await uploadRes.text();
      throw new Error(`S3 업로드 실패 (${uploadRes.status}): ${body}`);
    }
    return publicUrl;
  };

  /**
   * 사진이 있으면 로컬 미리보기로 목록에 먼저 띄운 뒤(스피너 표시), 백그라운드로 업로드가 끝나야 소켓으로 전송.
   * 업로드 중에도 입력창은 계속 쓸 수 있어서, 업로드 없는 다음 메시지가 먼저 도착할 수 있음(허용된 트레이드오프).
   * 46. 메시지 사진 첨부 참고.
   */
  const handleSend = () => {
    const text = draft.trim();
    const sendPhotos = photos;
    if (!text && sendPhotos.length === 0) return;

    const socket = getSocket();
    if (!socket) return;

    setDraft('');
    setPhotos([]);

    const clientMessageId = `temp-${Date.now()}`;
    const optimisticMessage: MessageData = {
      _id: clientMessageId,
      room: roomId,
      senderId: myUserId,
      senderName: '나',
      senderRole: 'member',
      text,
      photos: sendPhotos.map(photo => photo.uri),
      editable: false,
      hidden: false,
      hearts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    queryClient.setQueryData<MessageListResponse>(queryKey, old =>
      old ? { ...old, data: { ...old.data, messages: [optimisticMessage, ...old.data.messages] } } : old,
    );

    if (sendPhotos.length > 0) {
      setUploadingMessageIds(prev => new Set(prev).add(clientMessageId));
    }

    void (async () => {
      let photoUrls: string[] = [];
      if (sendPhotos.length > 0) {
        try {
          photoUrls = await Promise.all(sendPhotos.map(uploadPhoto));
        } catch (error) {
          console.error('사진 업로드 실패:', error);
          setUploadingMessageIds(prev => {
            const next = new Set(prev);
            next.delete(clientMessageId);
            return next;
          });
          setFailedMessageIds(prev => new Set(prev).add(clientMessageId));
          return;
        }
        setUploadingMessageIds(prev => {
          const next = new Set(prev);
          next.delete(clientMessageId);
          return next;
        });
      }

      socket.emit('send_message', { roomId, text, photos: photoUrls, clientMessageId }, (response: SendAck) => {
        if (response.error || !response.data) {
          queryClient.setQueryData<MessageListResponse>(queryKey, old =>
            old ? { ...old, data: { ...old.data, messages: old.data.messages.filter(m => m._id !== clientMessageId) } } : old,
          );
          return;
        }

        const sentMessage = response.data;
        queryClient.setQueryData<MessageListResponse>(queryKey, old => {
          if (!old) return old;
          if (old.data.messages.some(m => m._id === sentMessage._id)) return old;
          return { ...old, data: { ...old.data, messages: old.data.messages.map(m => (m._id === clientMessageId ? sentMessage : m)) } };
        });
      });
    })();
  };

  const handleHide = (messageId: string) => {
    Alert.alert('메시지 가리기', '이 메시지를 가릴까요?\n가리면 목록에서 보이지 않습니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '가리기',
        style: 'destructive',
        onPress: () => {
          const socket = getSocket();
          socket?.emit('hide_message', { messageId }, (response: HideAck) => {
            if (response.error) Alert.alert('안내', response.error);
          });
        },
      },
    ]);
  };

  const styles = useStyles(chatRoomStyleFactory);

  /** messages는 최신순(배열 앞이 최신)이라, index+1이 시간상 더 과거인 이웃 메시지 */
  const renderMessage = ({ item, index }: { item: MessageData; index: number }) => {
    const olderNeighbor: MessageData | undefined = messages[index + 1];
    const showDateDivider = !olderNeighbor || dayKey(olderNeighbor.createdAt) !== dayKey(item.createdAt);

    return (
      <MessageBubble
        message={item}
        showDateDivider={showDateDivider}
        hiddenLabel="가려진 메시지입니다"
        canManage={canManage}
        onHide={handleHide}
        isMine={item.senderId === myUserId}
        isUploadingPhotos={uploadingMessageIds.has(item._id)}
        hasUploadFailed={failedMessageIds.has(item._id)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {roomTitle}
        </Text>
      </View>

      <KeyboardGestureArea style={styles.wrapper} interpolator="ios" offset={COMPOSE_BAR_HEIGHT} textInputNativeID="chatroom-compose-input">
        {messages.length === 0 ? (
          <View style={styles.body}>
            <Text style={styles.emptyText}>아직 나눈 이야기가 없습니다</Text>
          </View>
        ) : (
          <FlatList
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            data={messages}
            keyExtractor={item => item._id}
            renderItem={renderMessage}
            inverted
            renderScrollComponent={renderScrollComponent}
          />
        )}

        <ComposeBar
          canSend={canSend}
          draft={draft}
          onChangeDraft={setDraft}
          photos={photos}
          onChangePhotos={setPhotos}
          onSend={handleSend}
          sendDisabled={!draft.trim() && photos.length === 0}
          placeholder="여기에 쓰세요"
          disabledPlaceholder="지금은 이야기할 수 있는 시간이 아닙니다"
          nativeID="chatroom-compose-input"
          offset={{ opened: insets.bottom }}
          onLayout={onComposeBarLayout}
        />
      </KeyboardGestureArea>
    </SafeAreaView>
  );
};

export default ChatRoom;

const chatRoomStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: semantic.bgPage,
    },
    wrapper: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      backgroundColor: semantic.bgSurface,
      borderBottomWidth: 1.5,
      borderBottomColor: semantic.border,
    },
    backButton: {
      width: hit.mobileCompact,
      height: hit.mobileCompact,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButtonText: {
      fontSize: fontSize('xl'),
    },
    headerTitle: {
      flex: 1,
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    body: {
      flex: 1,
    },
    /** inverted FlatList라 컨테이너가 위아래로 뒤집힘. paddingTop이 화면상으로는 하단 바 쪽 여백이 됨 */
    bodyContent: {
      padding: 16,
      paddingTop: 28,
      gap: 16,
    },
    emptyText: {
      padding: 18,
      textAlign: 'center',
      fontSize: fontSize('base'),
      fontFamily: fontFamily('regular'),
      color: color.grey600,
    },
  });
