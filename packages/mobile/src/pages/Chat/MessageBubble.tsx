import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, semantic, radius, hit } from '@common/shared';
import type { MessageData } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import { messageDateLabel, formatMessageTime } from './chatDisplay';

type Props = {
  message: MessageData;
  showDateDivider: boolean;
  hiddenLabel: string;
  canManage: boolean;
  onHide: (messageId: string) => void;
  /** 내가 보낸 메시지는 아바타·이름 없이 오른쪽 정렬(이야기방 전용). 공지방은 항상 false */
  isMine?: boolean;
  /** 메시지 메타 정보에서 시각을 가리기 버튼보다 먼저 보여줄지(공지방 전용) */
  timeFirst?: boolean;
};

const MessageBubble = ({ message, showDateDivider, hiddenLabel, canManage, onHide, isMine = false, timeFirst = false }: Props) => {
  const styles = useStyles(messageBubbleStyleFactory);

  const hideButton = canManage && !message.hidden && (
    <Pressable style={styles.hideButton} onPress={() => onHide(message._id)}>
      <Text style={styles.hideButtonText}>가리기</Text>
    </Pressable>
  );
  const timeText = <Text style={styles.messageTime}>{formatMessageTime(message.createdAt)}</Text>;

  return (
    <View>
      {showDateDivider && (
        <View style={styles.dateDividerWrap}>
          <Text style={styles.dateDivider}>{messageDateLabel(message.createdAt)}</Text>
        </View>
      )}
      <View style={[styles.messageRow, isMine && styles.messageRowMine]}>
        {!isMine && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{message.senderName.charAt(0)}</Text>
          </View>
        )}
        <View style={[styles.messageMain, isMine && styles.messageMainMine]}>
          {!isMine && <Text style={styles.senderName}>{message.senderName}</Text>}
          <View style={[styles.bubble, isMine && styles.bubbleMine]}>
            <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]} lineBreakStrategyIOS="hangul-word">
              {message.hidden ? hiddenLabel : message.text}
            </Text>
          </View>
          <View style={[styles.messageMeta, isMine && styles.messageMetaMine]}>
            {timeFirst ? (
              <>
                {timeText}
                {hideButton}
              </>
            ) : (
              <>
                {hideButton}
                {timeText}
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default MessageBubble;

const messageBubbleStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
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
    messageRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
    },
    messageRowMine: {
      justifyContent: 'flex-end',
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
    messageMainMine: {
      flex: 0,
      maxWidth: '78%',
      alignItems: 'flex-end',
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
    bubbleMine: {
      backgroundColor: color.navy,
      borderColor: color.navy,
      borderTopLeftRadius: 14,
      borderTopRightRadius: 5,
    },
    bubbleText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('regular'),
      lineHeight: fontSize('lg') * 1.6,
      color: semantic.textPrimary,
    },
    bubbleTextMine: {
      color: semantic.textOnDark,
    },
    messageMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 6,
      paddingHorizontal: 4,
    },
    messageMetaMine: {
      flexDirection: 'row-reverse',
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
  });
