import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtomValue } from 'jotai';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, semantic, radius, hit } from '@common/shared';
import { activeWelfareIdAtom } from '../../store/activeWelfare';
import useGetMemberships from '../../hooks/api/membership/useGetMemberships';
import useGetMeals from '../../hooks/api/meal/useGetMeals';
import useStyles, { type StyleFactoryArgs } from '../../hooks/styles/useStyles';
import type { RootStackParamList } from '../../router';
import { toIso, shiftMonth, monthLabel, dateLabel, dayWeekdayLabel, weekOf, calendarDays, calendarWeekdays } from './mealCalendarDisplay';

const TODAY_ISO = toIso(new Date());
const TODAY_MONTH = TODAY_ISO.slice(0, 7);

const MealCalendar = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const activeWelfareId = useAtomValue(activeWelfareIdAtom);
  const { data: membershipsData } = useGetMemberships();
  const memberships = membershipsData?.data ?? [];
  const activeMembership = memberships.find(m => m.welfare._id === activeWelfareId) ?? memberships[0] ?? null;
  const welfareId = activeMembership?.welfare._id ?? null;

  const [month, setMonth] = useState(TODAY_MONTH);
  const [selectedDate, setSelectedDate] = useState(TODAY_ISO);

  const { data: mealsData } = useGetMeals(welfareId, month);
  const meals = mealsData?.data ?? [];
  const mealsByDate = new Map(meals.map(meal => [meal.date, meal]));
  const selectedMeal = mealsByDate.get(selectedDate) ?? null;

  const days = calendarDays(month, selectedDate, TODAY_ISO, mealsByDate);
  const weeks = Array.from({ length: days.length / 7 }, (_, i) => days.slice(i * 7, i * 7 + 7));
  const weekdays = calendarWeekdays();
  const thisWeek = weekOf(selectedDate);

  const styles = useStyles(mealCalendarStyleFactory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>오늘의 밥</Text>
      </View>

      <ScrollView>
        <View style={styles.selectedCard}>
          <Text style={styles.selectedLabel}>{selectedDate === TODAY_ISO ? '오늘' : '선택한 날'}</Text>
          <Text style={styles.selectedText}>{selectedMeal ? selectedMeal.items.join(' · ') : '등록되지 않았습니다'}</Text>
          <Text style={styles.selectedWhen}>{dateLabel(selectedDate)}</Text>
        </View>

        <View style={styles.monthCard}>
          <View style={styles.monthNavRow}>
            <Pressable style={styles.monthNavButton} onPress={() => setMonth(prev => shiftMonth(prev, -1))}>
              <Text style={styles.monthNavButtonText}>‹</Text>
            </Pressable>
            <Text style={styles.monthLabel}>{monthLabel(month)}</Text>
            <Pressable style={styles.monthNavButton} onPress={() => setMonth(prev => shiftMonth(prev, 1))}>
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
                  <Pressable
                    key={day.iso}
                    style={[styles.dayCell, day.isSelected && styles.dayCellSelected]}
                    onPress={() => setSelectedDate(day.iso)}
                  >
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

        <View style={styles.weekCard}>
          <Text style={styles.weekCardTitle}>이번 주 식단</Text>
          {thisWeek.map(iso => {
            const meal = mealsByDate.get(iso);
            const isSelected = iso === selectedDate;

            return (
              <Pressable
                key={iso}
                style={[styles.weekRow, isSelected && styles.weekRowSelected]}
                onPress={() => {
                  setSelectedDate(iso);
                  setMonth(iso.slice(0, 7));
                }}
              >
                <Text style={[styles.weekRowDay, isSelected && styles.weekRowDaySelected]}>{dayWeekdayLabel(iso)}</Text>
                <Text style={styles.weekRowText} lineBreakStrategyIOS="hangul-word">
                  {meal ? meal.items.join(', ') : '등록되지 않았습니다'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MealCalendar;

const mealCalendarStyleFactory = ({ fontSize, fontFamily }: StyleFactoryArgs) =>
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
      borderTopColor: color.brown,
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
    selectedCard: {
      margin: 14,
      padding: 18,
      borderRadius: radius.mobileContainer,
      backgroundColor: color.brown,
    },
    selectedLabel: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('semibold'),
      color: 'rgba(255,255,255,0.85)',
    },
    selectedText: {
      fontSize: fontSize('xl'),
      fontFamily: fontFamily('bold'),
      lineHeight: fontSize('xl') * 1.5,
      marginTop: 8,
      color: color.grey0,
    },
    selectedWhen: {
      fontSize: fontSize('sm'),
      fontFamily: fontFamily('regular'),
      marginTop: 10,
      color: 'rgba(255,255,255,0.85)',
    },
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
