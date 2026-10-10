import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, semantic } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../../hooks/styles/useStyles';

export type FeedRoomOption = { id: string; label: string };

type Props = {
  options: FeedRoomOption[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string | null) => void;
};

const FeedRoomFilter = ({ options, selectedRoomId, onSelectRoom }: Props) => {
  const styles = useStyles(feedRoomFilterStyleFactory);

  return (
    <View style={styles.filterRowWrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterRowContent}>
        <Pressable style={[styles.filterChip, selectedRoomId === null && styles.filterChipActive]} onPress={() => onSelectRoom(null)}>
          <Text style={[styles.filterChipText, selectedRoomId === null && styles.filterChipTextActive]}>전체</Text>
        </Pressable>
        {options.map(option => (
          <Pressable
            key={option.id}
            style={[styles.filterChip, selectedRoomId === option.id && styles.filterChipActive]}
            onPress={() => onSelectRoom(option.id)}
          >
            <Text style={[styles.filterChipText, selectedRoomId === option.id && styles.filterChipTextActive]}>{option.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default FeedRoomFilter;

const feedRoomFilterStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    /** ScrollView 자체에 height를 줘도 안 먹는 경우가 있어서, 높이 고정된 View로 감싸고 ScrollView는 그 안을 꽉 채움 */
    filterRowWrap: {
      height: hit.mobileCompact + 28,
      backgroundColor: semantic.bgSurface,
      borderBottomWidth: 1.5,
      borderBottomColor: semantic.border,
    },
    filterRow: {
      flex: 1,
    },
    filterRowContent: {
      alignItems: 'center',
      gap: 8,
      padding: 14,
    },
    filterChip: {
      flexShrink: 0,
      minHeight: hit.mobileCompact,
      paddingHorizontal: 18,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: semantic.bgSurface,
    },
    filterChipActive: {
      backgroundColor: color.navy,
      borderColor: color.navy,
    },
    filterChipText: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    filterChipTextActive: {
      color: semantic.textOnDark,
    },
  });
