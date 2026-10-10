import { StyleSheet, Text, View } from 'react-native';
import { color, radius, semantic } from '@common/shared';
import type { CommentData } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../../hooks/styles/useStyles';
import { formatMessageTime, messageDateLabel } from '../../../features/chat/chatDisplay';
import ChatAvatar from '../../../features/chat/ChatAvatar';

type Props = {
  comment: CommentData;
  isMine: boolean;
  showDateDivider: boolean;
  avatarUrl?: string;
};

const CommentRow = ({ comment, isMine, showDateDivider, avatarUrl }: Props) => {
  const styles = useStyles(commentRowStyleFactory);

  return (
    <View>
      {showDateDivider && (
        <View style={styles.dateDividerWrap}>
          <Text style={styles.dateDivider}>{messageDateLabel(comment.createdAt)}</Text>
        </View>
      )}
      <View style={[styles.commentRow, isMine && styles.commentRowMine]}>
        {!isMine && <ChatAvatar size={52} borderRadius={15} initial={comment.userName.charAt(0)} photoUrl={avatarUrl} />}
        <View style={[styles.commentMain, isMine && styles.commentMainMine]}>
          {!isMine && <Text style={styles.commentName}>{comment.userName}</Text>}
          <View style={[styles.commentBubble, isMine && styles.commentBubbleMine]}>
            <Text style={[styles.commentText, isMine && styles.commentTextMine]}>{comment.text}</Text>
          </View>
          <Text style={[styles.commentTime, isMine && styles.commentTimeMine]}>{formatMessageTime(comment.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
};

export default CommentRow;

const commentRowStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
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
  });
