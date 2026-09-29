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
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import type { RootStackParamList } from '../../router';
import { dayKey } from '../Chat/chatDisplay';
import MessageBubble from '../Chat/MessageBubble';
import ComposeBar from '../Chat/ComposeBar';

const NoticeRoom = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'NoticeRoom'>>();
  const { welfareId, roomId, roomTitle } = params;

  const { data: messagesData } = useGetRoomMessages(welfareId, roomId);
  const messages = messagesData?.data.messages ?? [];
  const canSend = messagesData?.data.canSend ?? false;
  const canManage = messagesData?.data.canManage ?? false;

  const [draft, setDraft] = useState('');
  const { mutate: send, isPending: isSending } = useSendNotice(welfareId, roomId);
  const { mutate: hide } = useHideMessage(welfareId, roomId);

  const { insets, renderScrollComponent, onComposeBarLayout } = useComposeBarKeyboard();

  const handleSend = () => {
    if (!draft.trim()) return;
    send(draft, { onSuccess: () => setDraft('') });
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
          onSend={handleSend}
          sendDisabled={isSending || !draft.trim()}
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
