import { Pressable, StyleSheet, Text } from 'react-native';
import { color } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../../hooks/styles/useStyles';

type Props = {
  todayMealText: string;
  onPress: () => void;
};

const MealBanner = ({ todayMealText, onPress }: Props) => {
  const styles = useStyles(mealBannerStyleFactory);

  return (
    <Pressable style={styles.mealBanner} onPress={onPress}>
      <Text style={styles.mealBannerLabel}>오늘의 밥</Text>
      <Text style={styles.mealBannerValue} numberOfLines={1} ellipsizeMode="tail">
        {todayMealText}
      </Text>
      <Text style={styles.mealBannerChevron}>›</Text>
    </Pressable>
  );
};

export default MealBanner;

const mealBannerStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    mealBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 18,
      paddingVertical: 16,
      backgroundColor: color.brown,
    },
    mealBannerLabel: {
      flexShrink: 0,
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: 'rgba(255,255,255,0.82)',
    },
    mealBannerValue: {
      flexShrink: 1,
      flexGrow: 1,
      minWidth: 0,
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
      color: color.grey0,
    },
    mealBannerChevron: {
      flexShrink: 0,
      fontSize: fontSize('xxl'),
      color: color.grey0,
    },
  });
