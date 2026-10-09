import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardStickyView, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, { scrollTo, useAnimatedReaction, useAnimatedRef, useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { color, semantic, radius, hit } from '@common/shared';
import type { CommentData, CommentListResponse } from '@common/shared';
import useGetMemberships from '../../hooks/api/membership/useGetMemberships';
import useGetUserAvatars from '../../hooks/api/auth/useGetUserAvatars';
import useGetComments from '../../hooks/api/room/useGetComments';
import { getSocket } from '../../libs/socket';
import useSocketEvents from '../../hooks/socket/useSocketEvents';
import { QUERY_KEYS } from '../../constant/queryKeys';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import type { RootStackParamList } from '../../router';
import { dayKey, formatMessageTime, messageDateLabel } from '../../features/chat/chatDisplay';
import ChatAvatar from '../../features/chat/ChatAvatar';

type Ack = { error?: string };

const PhotoComments = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'PhotoComments'>>();
  const { welfareId, roomId, messageId } = params;
  const queryClient = useQueryClient();
  const commentsQueryKey = [QUERY_KEYS.COMMENTS, welfareId, roomId, messageId];

  const { data: membershipsData } = useGetMemberships();
  const myUserId = (membershipsData?.data ?? []).find(m => m.welfare._id === welfareId)?.userId ?? '';

  const { data: commentsData } = useGetComments(welfareId, roomId, messageId);
  const comments = commentsData?.data ?? [];

  const { data: avatarByUserId } = useGetUserAvatars(comments.map(c => c.userId));

  const [draft, setDraft] = useState('');
  const insets = useSafeAreaInsets();
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  /** 컴포즈바가 KeyboardStickyView로 따로 떠 있어서, 목록 맨 아래에 키보드 높이만큼 커지는 여백을 직접 두고, 키보드가 움직이는 동안 매 프레임 맨 아래로 스크롤을 맞춰줌(항상 컴포즈바 쪽이 포커스 대상이라 위치 계산 없이 "끝까지 스크롤"만 하면 됨) */
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();
  const keyboardSpacerStyle = useAnimatedStyle(() => ({ height: -keyboardHeight.value }));

  useAnimatedReaction(
    () => keyboardHeight.value,
    (current, previous) => {
      if (previous !== null && current !== previous) {
        scrollTo(scrollViewRef, 0, 1e6, false);
      }
    },
  );

  useSocketEvents(
    () => ({
      new_comment: ({ comment }: { comment: CommentData; commentCount: number }) => {
        if (comment.message !== messageId) return;
        queryClient.setQueryData<CommentListResponse>(commentsQueryKey, old => {
          if (!old) return old;
          if (old.data.some(c => c._id === comment._id)) return old;
          return { ...old, data: [...old.data, comment] };
        });
      },
    }),
    [messageId],
  );

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    const socket = getSocket();
    if (!socket) return;

    setDraft('');
    socket.emit('add_comment', { messageId, text }, (response: Ack) => {
      if (response.error) Alert.alert('안내', response.error);
    });
  };

  const styles = useStyles(photoCommentsStyleFactory);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>댓글 {comments.length}개</Text>
      </View>

      <View style={styles.wrapper}>
        <Animated.ScrollView ref={scrollViewRef} style={styles.body} contentContainerStyle={styles.bodyContent}>
          {comments.length === 0 ? (
            <Text style={styles.emptyText}>아직 댓글이 없습니다</Text>
          ) : (
            comments.map((item, index) => {
              const isMine = item.userId === myUserId;
              const previous = comments[index - 1];
              const showDateDivider = !previous || dayKey(previous.createdAt) !== dayKey(item.createdAt);
              return (
                <View key={item._id}>
                  {showDateDivider && (
                    <View style={styles.dateDividerWrap}>
                      <Text style={styles.dateDivider}>{messageDateLabel(item.createdAt)}</Text>
                    </View>
                  )}
                  <View style={[styles.commentRow, isMine && styles.commentRowMine]}>
                    {!isMine && (
                      <ChatAvatar size={52} borderRadius={15} initial={item.userName.charAt(0)} photoUrl={avatarByUserId?.get(item.userId)} />
                    )}
                    <View style={[styles.commentMain, isMine && styles.commentMainMine]}>
                      {!isMine && <Text style={styles.commentName}>{item.userName}</Text>}
                      <View style={[styles.commentBubble, isMine && styles.commentBubbleMine]}>
                        <Text style={[styles.commentText, isMine && styles.commentTextMine]}>{item.text}</Text>
                      </View>
                      <Text style={[styles.commentTime, isMine && styles.commentTimeMine]}>{formatMessageTime(item.createdAt)}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
          <Animated.View style={keyboardSpacerStyle} />
        </Animated.ScrollView>

        <KeyboardStickyView offset={{ opened: insets.bottom }}>
          <View style={styles.composeBar}>
            <TextInput value={draft} onChangeText={setDraft} placeholder="댓글을 쓰세요" style={styles.composeInput} multiline />
            <Pressable style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]} onPress={handleSend} disabled={!draft.trim()}>
              <Text style={styles.sendButtonText}>올리기</Text>
            </Pressable>
          </View>
        </KeyboardStickyView>
      </View>
    </SafeAreaView>
  );
};

export default PhotoComments;

const photoCommentsStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
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
    bodyContent: {
      padding: 16,
      gap: 14,
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
    commentRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
    },
    commentRowMine: {
      justifyContent: 'flex-end',
    },
    commentMain: {
      flex: 1,
      minWidth: 0,
    },
    commentMainMine: {
      flex: 0,
      maxWidth: '78%',
      alignItems: 'flex-end',
    },
    commentName: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('semibold'),
      color: color.grey600,
      marginBottom: 4,
      paddingHorizontal: 4,
    },
    commentBubble: {
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
    commentBubbleMine: {
      backgroundColor: color.navy,
      borderColor: color.navy,
      borderTopLeftRadius: 14,
      borderTopRightRadius: 5,
    },
    commentText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('lg') * 1.6,
      color: semantic.textPrimary,
    },
    commentTextMine: {
      color: semantic.textOnDark,
    },
    commentTime: {
      marginTop: 6,
      paddingHorizontal: 4,
      fontSize: fontSize('caption'),
      color: color.grey500,
    },
    commentTimeMine: {
      textAlign: 'right',
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
    sendButtonDisabled: {
      backgroundColor: color.grey150,
    },
    sendButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textOnDark,
    },
  });
