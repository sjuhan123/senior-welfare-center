import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, semantic } from '@common/shared';
import useStyles, { type StyleFactoryArgs } from '../../../hooks/styles/useStyles';
import type { CalendarDay } from '../mealCalendarDisplay';

type Props = {
  monthText: string;
  weekdays: string[];
  weeks: CalendarDay[][];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (iso: string) => void;
};

const MonthCalendarCard = ({ monthText, weekdays, weeks, onPrevMonth, onNextMonth, onSelectDate }: Props) => {
  const styles = useStyles(monthCalendarCardStyleFactory);

  return (
    <View style={styles.monthCard}>
      <View style={styles.monthNavRow}>
        <Pressable style={styles.monthNavButton} onPress={onPrevMonth}>
          <Text style={styles.monthNavButtonText}>‹</Text>
        </Pressable>
        <Text style={styles.monthLabel}>{monthText}</Text>
        <Pressable style={styles.monthNavButton} onPress={onNextMonth}>
          <Text style={styles.monthNavButtonText}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {weekdays.map(weekday => (
          <Text key={weekday} style={styles.weekdayText}>
            {weekday}
          </Text>
        ))}
      </View>

      <View style={styles.dayGrid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.dayWeekRow}>
            {week.map(day => (
              <Pressable key={day.iso} style={[styles.dayCell, day.isSelected && styles.dayCellSelected]} onPress={() => onSelectDate(day.iso)}>
                <Text
                  style={[
                    styles.dayNum,
                    !day.inMonth && styles.dayNumOutside,
                    day.isToday && styles.dayNumToday,
                    day.isSelected && styles.dayNumSelected,
                  ]}
                >
                  {day.num}
                </Text>
                {day.hasMeal && <View style={styles.dayDot} />}
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default MonthCalendarCard;

const monthCalendarCardStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
  StyleSheet.create({
    monthCard: {
      marginHorizontal: 14,
      backgroundColor: semantic.bgSurface,
      borderWidth: 1,
      borderColor: semantic.border,
      borderRadius: radius.mobileContainer,
      padding: 12,
    },
    monthNavRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    monthNavButton: {
      width: hit.mobileCompact,
      height: hit.mobileCompact,
      borderWidth: 1.5,
      borderColor: color.grey400,
      borderRadius: radius.mobileContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    monthNavButtonText: {
      fontSize: fontSize('xl'),
    },
    monthLabel: {
      flex: 1,
      textAlign: 'center',
      fontSize: fontSize('lg'),
      fontFamily: fontFamily('bold'),
    },
    weekdayRow: {
      flexDirection: 'row',
      marginTop: 8,
    },
    weekdayText: {
      flex: 1,
      textAlign: 'center',
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('bold'),
      color: color.grey600,
      paddingVertical: 6,
    },
    dayGrid: {
      marginTop: 4,
    },
    dayWeekRow: {
      flexDirection: 'row',
    },
    dayCell: {
      flex: 1,
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      borderRadius: radius.label,
    },
    dayCellSelected: {
      backgroundColor: color.navySoft,
    },
    dayNum: {
      fontSize: fontSize('base'),
      fontFamily: fontFamily('semibold'),
      color: semantic.textPrimary,
    },
    dayNumOutside: {
      color: color.grey400,
    },
    dayNumToday: {
      color: color.brown,
      fontFamily: fontFamily('bold'),
    },
    dayNumSelected: {
      color: color.navyDeep,
      fontFamily: fontFamily('bold'),
    },
    dayDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: color.brown,
    },
  });
