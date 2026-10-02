import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { KeyboardGestureArea } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, semantic, radius, hit } from '@common/shared';
import type { MessageData } from '@common/shared';
import useGetRoomMessages from '../../hooks/api/room/useGetRoomMessages';
import useSendNotice from '../../hooks/api/room/useSendNotice';
import useHideMessage from '../../hooks/api/room/useHideMessage';
import useComposeBarKeyboard, { COMPOSE_BAR_HEIGHT } from '../../hooks/keyboard/useComposeBarKeyboard';
import { presignPhotoUpload } from '../../hooks/api/room/usePresignPhotoUpload';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import type { RootStackParamList } from '../../router';
import { dayKey } from '../Chat/chatDisplay';
import MessageBubble from '../Chat/MessageBubble';
import ComposeBar, { type SelectedPhoto } from '../Chat/ComposeBar';

const NoticeRoom = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'NoticeRoom'>>();
  const { welfareId, roomId, roomTitle } = params;

  const { data: messagesData } = useGetRoomMessages(welfareId, roomId);
  const messages = messagesData?.data.messages ?? [];
  const canSend = messagesData?.data.canSend ?? false;
  const canManage = messagesData?.data.canManage ?? false;

  const [draft, setDraft] = useState('');
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { mutate: send, isPending: isSending } = useSendNotice(welfareId, roomId);
  const { mutate: hide } = useHideMessage(welfareId, roomId);

  const { insets, renderScrollComponent, onComposeBarLayout } = useComposeBarKeyboard();

  /** 사진은 presigned URL로 S3에 먼저 업로드한 뒤, 완료된 URL만 메시지에 실어 보냄. 46. 메시지 사진 첨부 참고. */
  const uploadPhotos = async (): Promise<string[]> => {
    return Promise.all(
      photos.map(async photo => {
        const presignRes = await presignPhotoUpload(welfareId, roomId, photo.contentType);
        const { uploadUrl, publicUrl } = presignRes.data;
        const fileBlob = await (await fetch(photo.uri)).blob();
        const uploadRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': photo.contentType }, body: fileBlob });
        if (!uploadRes.ok) {
          const body = await uploadRes.text();
          throw new Error(`S3 업로드 실패 (${uploadRes.status}): ${body}`);
        }
        return publicUrl;
      }),
    );
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text && photos.length === 0) return;
    if (isUploading) return;

    void (async () => {
      setIsUploading(true);
      let photoUrls: string[];
      try {
        photoUrls = await uploadPhotos();
      } catch (error) {
        console.error('사진 업로드 실패:', error);
        setIsUploading(false);
        Alert.alert('안내', `사진 업로드에 실패했습니다.\n${error instanceof Error ? error.message : ''}`);
        return;
      }
      setIsUploading(false);

      send(
        { text, photos: photoUrls },
        {
          onSuccess: () => {
            setDraft('');
            setPhotos([]);
          },
        },
      );
    })();
  };

  const handleHide = (messageId: string) => {
    Alert.alert('공지 가리기', '이 공지를 가릴까요?\n가리면 목록에서 보이지 않습니다.', [
      { text: '취소', style: 'cancel' },
      { text: '가리기', style: 'destructive', onPress: () => hide(messageId) },
    ]);
  };

  const styles = useStyles(noticeRoomStyleFactory);

  /** messages는 최신순(배열 앞이 최신)이라, index+1이 시간상 더 과거인 이웃 메시지 */
  const renderMessage = ({ item, index }: { item: MessageData; index: number }) => {
    const olderNeighbor: MessageData | undefined = messages[index + 1];
    const showDateDivider = !olderNeighbor || dayKey(olderNeighbor.createdAt) !== dayKey(item.createdAt);

    return (
      <MessageBubble
        message={item}
        showDateDivider={showDateDivider}
        hiddenLabel="가려진 공지입니다"
        canManage={canManage}
        onHide={handleHide}
        timeFirst
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

      <KeyboardGestureArea style={styles.wrapper} interpolator="ios" offset={COMPOSE_BAR_HEIGHT} textInputNativeID="noticeroom-compose-input">
        {messages.length === 0 ? (
          <View style={styles.body}>
            <Text style={styles.emptyText}>아직 온 소식이 없습니다</Text>
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
          sendDisabled={isSending || isUploading || (!draft.trim() && photos.length === 0)}
          placeholder="공지 내용을 적으세요"
          disabledPlaceholder="이 방은 쓰기가 안 됩니다"
          nativeID="noticeroom-compose-input"
          offset={{ opened: insets.bottom }}
          onLayout={onComposeBarLayout}
        />
      </KeyboardGestureArea>
    </SafeAreaView>
  );
};

export default NoticeRoom;

const noticeRoomStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
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
      borderTopWidth: 3,
      borderTopColor: color.navy,
      borderBottomWidth: 1,
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
