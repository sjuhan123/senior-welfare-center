import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, semantic, radius, hit } from '@common/shared';
import type { MessageData } from '@common/shared';
import useGetMemberships from '../../hooks/api/membership/useGetMemberships';
import useGetCourses from '../../hooks/api/course/useGetCourses';
import useGetRoomMessages from '../../hooks/api/room/useGetRoomMessages';
import useSendNotice from '../../hooks/api/room/useSendNotice';
import useHideMessage from '../../hooks/api/room/useHideMessage';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import type { RootStackParamList } from '../../router';
import { dayKey, formatTime, messageDateLabel } from '../Chat/chatDisplay';

const NoticeRoom = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'NoticeRoom'>>();
  const { welfareId, roomId, courseId, roomTitle } = params;

  const { data: membershipsData } = useGetMemberships();
  const membership = (membershipsData?.data ?? []).find(m => m.welfare._id === welfareId) ?? null;

  const { data: coursesData } = useGetCourses(welfareId);
  const course = courseId ? (coursesData?.data ?? []).find(c => c._id === courseId) ?? null : null;

  const { data: messagesData } = useGetRoomMessages(welfareId, roomId);
  const messages = messagesData?.data ?? [];

  const [draft, setDraft] = useState('');
  const { mutate: send, isPending: isSending } = useSendNotice(welfareId, roomId);
  const { mutate: hide } = useHideMessage(welfareId, roomId);

  const canManage =
    !!membership && (membership.role === 'admin' || membership.role === 'super' || (!!course && course.teacher === membership.userId));

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
      <View>
        {showDateDivider && (
          <View style={styles.dateDividerWrap}>
            <Text style={styles.dateDivider}>{messageDateLabel(item.createdAt)}</Text>
          </View>
        )}
        <View style={styles.messageRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.senderName.charAt(0)}</Text>
          </View>
          <View style={styles.messageMain}>
            <Text style={styles.senderName}>{item.senderName}</Text>
            <View style={styles.bubble}>
              <Text style={styles.bubbleText} lineBreakStrategyIOS="hangul-word">
                {item.hidden ? '가려진 공지입니다' : item.text}
              </Text>
            </View>
            <View style={styles.messageMeta}>
              <Text style={styles.messageTime}>{formatTime(item.createdAt)}</Text>
              {canManage && !item.hidden && (
                <Pressable style={styles.hideButton} onPress={() => handleHide(item._id)}>
                  <Text style={styles.hideButtonText}>가리기</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
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
        />
      )}

      {canManage ? (
        <View style={styles.composeBar}>
          <TextInput value={draft} onChangeText={setDraft} placeholder="공지 내용을 적으세요" style={styles.composeInput} multiline />
          <Pressable style={styles.sendButton} onPress={handleSend} disabled={isSending || !draft.trim()}>
            <Text style={styles.sendButtonText}>보내기</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.composeBar}>
          <TextInput
            value=""
            editable={false}
            placeholder="이 방은 쓰기가 안 됩니다"
            style={[styles.composeInput, styles.composeInputDisabled]}
            multiline
          />
          <View style={[styles.sendButton, styles.sendButtonDisabled]}>
            <Text style={styles.sendButtonTextDisabled}>보내기</Text>
          </View>
        </View>
      )}
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
    dateDividerWrap: {
      alignItems: 'center',
      marginBottom: 16,
    },
    dateDivider: {
      paddingHorizontal: 15,
      paddingVertical: 7,
      borderRadius: radius.label,
      backgroundColor: color.grey150,
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('semibold'),
      color: color.grey700,
    },
    messageRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
    },
    avatar: {
      flexShrink: 0,
      width: 52,
      height: 52,
      borderRadius: 15,
      backgroundColor: color.grey150,
      borderWidth: 1,
      borderColor: color.grey300,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: color.grey600,
    },
    messageMain: {
      flex: 1,
      minWidth: 0,
    },
    senderName: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('semibold'),
      color: color.grey600,
      marginBottom: 4,
      paddingHorizontal: 4,
    },
    bubble: {
      alignSelf: 'flex-start',
      maxWidth: '100%',
      backgroundColor: semantic.bgSurface,
      borderWidth: 1.5,
      borderColor: semantic.border,
      borderRadius: 14,
      borderTopLeftRadius: 5,
      paddingHorizontal: 18,
      paddingVertical: 15,
    },
    bubbleText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('lg') * 1.6,
      color: semantic.textPrimary,
    },
    messageMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 6,
      paddingHorizontal: 4,
    },
    messageTime: {
      fontSize: fontSize('caption'),
      color: color.grey500,
    },
    hideButton: {
      minHeight: hit.mobileCompact,
      paddingHorizontal: 14,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.label,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hideButtonText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: color.grey700,
    },
    composeBar: {
      flexDirection: 'row',
      gap: 10,
      padding: 12,
      backgroundColor: semantic.bgSurface,
      borderTopWidth: 1.5,
      borderTopColor: semantic.border,
    },
    composeInput: {
      flex: 1,
      minHeight: hit.mobileLarge,
      maxHeight: 120,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
      backgroundColor: semantic.bgSurface,
      fontFamily: fontFamily('regular'),
      fontSize: fontSize('lg'),
      color: semantic.textPrimary,
    },
    sendButton: {
      flexShrink: 0,
      minWidth: 90,
      minHeight: hit.mobileLarge,
      borderRadius: radius.mobileContainer,
      backgroundColor: color.navy,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
    },
    composeInputDisabled: {
      backgroundColor: color.grey50,
      borderColor: color.grey300,
      color: color.grey500,
    },
    sendButtonDisabled: {
      backgroundColor: color.grey150,
    },
    sendButtonTextDisabled: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: color.grey500,
    },
  });
