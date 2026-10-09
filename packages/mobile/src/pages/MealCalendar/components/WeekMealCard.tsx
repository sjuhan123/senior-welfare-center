import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, semantic } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../../hooks/styles/useStyles';

export type WeekMealDay = {
  iso: string;
  dayLabel: string;
  mealText: string;
  isSelected: boolean;
};

type Props = {
  days: WeekMealDay[];
  onSelectDate: (iso: string) => void;
};

const WeekMealCard = ({ days, onSelectDate }: Props) => {
  const styles = useStyles(weekMealCardStyleFactory);

  return (
    <View style={styles.weekCard}>
      <Text style={styles.weekCardTitle}>이번 주 식단</Text>
      {days.map(day => (
        <Pressable key={day.iso} style={[styles.weekRow, day.isSelected && styles.weekRowSelected]} onPress={() => onSelectDate(day.iso)}>
          <Text style={[styles.weekRowDay, day.isSelected && styles.weekRowDaySelected]}>{day.dayLabel}</Text>
          <Text style={styles.weekRowText} lineBreakStrategyIOS="hangul-word">
            {day.mealText}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default WeekMealCard;

const weekMealCardStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    weekCard: {
      margin: 14,
      padding: 14,
      backgroundColor: semantic.bgSurface,
      borderWidth: 1,
      borderColor: semantic.border,
      borderRadius: radius.mobileContainer,
    },
    weekCardTitle: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('bold'),
      color: color.grey600,
    },
    weekRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: hit.mobileCompact,
      paddingHorizontal: 10,
      marginTop: 8,
      borderRadius: radius.mobileButton,
    },
    weekRowSelected: {
      backgroundColor: color.navySoft,
    },
    weekRowDay: {
      flex: 0,
      width: 84,
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: color.grey700,
    },
    weekRowDaySelected: {
      color: color.navyDeep,
    },
    weekRowText: {
      flexGrow: 1,
      flexShrink: 1,
      minWidth: 0,
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      color: color.grey700,
    },
  });
