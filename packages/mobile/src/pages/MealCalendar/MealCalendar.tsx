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
import { shiftMonth, monthLabel, dateLabel, dayWeekdayLabel, weekOf, calendarDays, calendarWeekdays } from './mealCalendarDisplay';
import { toIso } from '../../utills/toIso';
import SelectedMealCard from './components/SelectedMealCard';
import MonthCalendarCard from './components/MonthCalendarCard';
import WeekMealCard from './components/WeekMealCard';

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
        <SelectedMealCard
          label={selectedDate === TODAY_ISO ? '오늘' : '선택한 날'}
          mealText={selectedMeal ? selectedMeal.items.join(' · ') : '등록되지 않았습니다'}
          dateText={dateLabel(selectedDate)}
        />

        <MonthCalendarCard
          monthText={monthLabel(month)}
          weekdays={weekdays}
          weeks={weeks}
          onPrevMonth={() => setMonth(prev => shiftMonth(prev, -1))}
          onNextMonth={() => setMonth(prev => shiftMonth(prev, 1))}
          onSelectDate={setSelectedDate}
        />

        <WeekMealCard
          days={thisWeek.map(iso => ({
            iso,
            dayLabel: dayWeekdayLabel(iso),
            mealText: mealsByDate.get(iso) ? mealsByDate.get(iso)!.items.join(', ') : '등록되지 않았습니다',
            isSelected: iso === selectedDate,
          }))}
          onSelectDate={iso => {
            setSelectedDate(iso);
            setMonth(iso.slice(0, 7));
          }}
        />
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
  });
