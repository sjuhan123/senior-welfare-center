import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { color, semantic, radius, hit } from '@common/shared';
import type { LostItemData } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';

const STEP = 3;

// RN의 borderStyle:'dashed'는 한쪽 변만 줄 때(borderBottomWidth) iOS에서 아예 안 그려지는
// 경우가 있어서, 점선 구분선은 SVG로 직접 그린다.
const DashedDivider = () => (
  <Svg height={1} width="100%">
    <Line x1="0" y1="0.5" x2="100%" y2="0.5" stroke={color.grey400} strokeWidth={1} strokeDasharray="5,5" />
  </Svg>
);

const CenterLostItemList = ({ lostItems }: { lostItems: LostItemData[] }) => {
  const [limit, setLimit] = useState(STEP);
  const styles = useStyles(centerLostItemListStyleFactory);

  const visibleItems = lostItems.slice(0, limit);
  const rest = lostItems.length - limit;
  const showMore = rest > 0;
  const showFold = rest <= 0 && lostItems.length > STEP;
  const moreLabel = `물건 ${Math.min(STEP, Math.max(rest, 0))}개 더 보기 (남은 ${Math.max(rest, 0)}개)`;

  return lostItems.length === 0 ? (
    <Text style={styles.emptyText}>등록된 분실물이 없습니다</Text>
  ) : (
    <View style={styles.list}>
      {visibleItems.map(lostItem => (
        <View key={lostItem._id}>
          <View style={styles.row}>
            <Text style={styles.name}>{lostItem.item}</Text>
            <Text style={styles.meta}>
              {lostItem.where} · {lostItem.when}
            </Text>
            <Text style={styles.keep}>{lostItem.keep}</Text>
          </View>
          <DashedDivider />
        </View>
      ))}

      {showMore && (
        <Pressable style={styles.moreButton} onPress={() => setLimit(prev => prev + STEP)}>
          <Text style={styles.moreButtonText}>{moreLabel}</Text>
          <Text style={styles.moreButtonArrow}>▾</Text>
        </Pressable>
      )}

      {showFold && (
        <Pressable style={styles.foldButton} onPress={() => setLimit(STEP)}>
          <Text style={styles.foldButtonText}>처음처럼 접기</Text>
          <Text style={styles.foldButtonArrow}>▴</Text>
        </Pressable>
      )}
    </View>
  );
};

export default CenterLostItemList;

const centerLostItemListStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    emptyText: {
      paddingHorizontal: 18,
      fontSize: fontSize('base'),
      fontFamily: fontFamily('regular'),
      color: color.grey600,
    },
    list: {
      paddingHorizontal: 18,
      paddingBottom: 24,
    },
    row: {
      paddingVertical: 14,
    },
    name: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: semantic.textPrimary,
    },
    meta: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      marginTop: 6,
      color: color.grey700,
    },
    keep: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('semibold'),
      marginTop: 4,
      color: semantic.urgent,
    },
    moreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 12,
      marginBottom: 4,
      minHeight: hit.mobileMin,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
    },
    moreButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: color.navyDeep,
    },
    moreButtonArrow: {
      fontSize: fontSize('xl'),
      color: color.navyDeep,
    },
    foldButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 12,
      marginBottom: 4,
      minHeight: hit.mobileMin,
      borderWidth: 1.5,
      borderColor: color.grey300,
      borderRadius: radius.mobileContainer,
      backgroundColor: color.grey50,
    },
    foldButtonText: {
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: color.grey600,
    },
    foldButtonArrow: {
      fontSize: fontSize('xl'),
      color: color.grey600,
    },
  });
