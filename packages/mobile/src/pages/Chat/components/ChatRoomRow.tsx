import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, semantic } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../../hooks/styles/useStyles';

type Props = {
  title: string;
  isNotice: boolean;
  previewLabel: string;
  timeLabel: string | null;
  unreadCount: number;
  onPress: () => void;
};

const ChatRoomRow = ({ title, isNotice, previewLabel, timeLabel, unreadCount, onPress }: Props) => {
  const styles = useStyles(chatRoomRowStyleFactory);

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowMain}>
        <View style={styles.rowNameLine}>
          <Text style={styles.rowName} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          {isNotice && (
            <View style={styles.noticeBadge}>
              <Text style={styles.noticeBadgeText}>공지</Text>
            </View>
          )}
        </View>
        <Text style={styles.rowPreview} numberOfLines={1} ellipsizeMode="tail">
          {previewLabel}
        </Text>
      </View>
      <View style={styles.rowSide}>
        {timeLabel && <Text style={styles.rowTime}>{timeLabel}</Text>}
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default ChatRoomRow;

const chatRoomRowStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 14,
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: semantic.divider,
    },
    rowMain: {
      flex: 1,
      minWidth: 0,
    },
    rowNameLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      minWidth: 0,
    },
    rowName: {
      flexShrink: 1,
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    noticeBadge: {
      flexShrink: 0,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: color.navySoft,
    },
    noticeBadgeText: {
      fontSize: fontSize('caption'),
      fontFamily: fontFamily('bold'),
      color: color.navyDeep,
    },
    rowPreview: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('regular'),
      marginTop: 4,
      color: color.grey700,
    },
    rowSide: {
      flexShrink: 0,
      alignItems: 'flex-end',
      gap: 8,
    },
    rowTime: {
      fontSize: fontSize('caption'),
      color: color.grey500,
    },
    unreadBadge: {
      minWidth: 36,
      height: 36,
      paddingHorizontal: 10,
      borderRadius: 18,
      backgroundColor: color.brown,
      alignItems: 'center',
      justifyContent: 'center',
    },
    unreadBadgeText: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: color.grey0,
    },
  });
