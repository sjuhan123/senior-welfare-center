import styled from '@emotion/styled';
import { color } from '@common/shared';
import type { MealData } from '@common/shared';
import { calendarDays, monthLabel } from './mealDate';

const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

const weekdayColor = (dayOfWeek: number) => {
  if (dayOfWeek === 0) return color.alert;
  if (dayOfWeek === 6) return color.navy;
  return undefined;
};

const cellBg = (day: { inMonth: boolean; isSelected: boolean; weekend: boolean; hasMeal: boolean }) => {
  if (!day.inMonth) return color.grey50;
  if (day.isSelected) return color.navyTint;
  if (day.weekend) return color.grey50;
  if (day.hasMeal) return color.navySoft;
  return color.grey0;
};

const numberColor = (day: { inMonth: boolean; dayOfWeek: number }) => {
  if (!day.inMonth) return color.grey400;
  return weekdayColor(day.dayOfWeek);
};

type Props = {
  month: string;
  selectedDate: string;
  todayIso: string;
  meals: MealData[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onThisMonth: () => void;
  onSelectDate: (date: string) => void;
  onCopyLastWeek: () => void;
};

const MealCalendar = ({ month, selectedDate, todayIso, meals, onPrevMonth, onNextMonth, onThisMonth, onSelectDate, onCopyLastWeek }: Props) => {
  const mealsByDate = new Map(meals.map(meal => [meal.date, meal]));
  const days = calendarDays(month, selectedDate, todayIso, mealsByDate);
  const filledCount = meals.length;

  return (
    <Card>
      <Header>
        <NavButton onClick={onPrevMonth}>‹</NavButton>
        <MonthLabel>{monthLabel(month)}</MonthLabel>
        <NavButton onClick={onNextMonth}>›</NavButton>
        <TextButton onClick={onThisMonth}>이번 달</TextButton>
        <Spacer />
        <FilledText>등록된 날 {filledCount}일</FilledText>
        <TextButton onClick={onCopyLastWeek}>지난주 식단 복사</TextButton>
      </Header>

      <WeekdayRow>
        {WEEKDAY_NAMES.map((name, i) => (
          <Weekday key={name} style={{ color: weekdayColor(i) }}>
            {name}
          </Weekday>
        ))}
      </WeekdayRow>

      <Grid>
        {days.map(day => (
          <DayCell
            key={day.iso}
            onClick={() => day.inMonth && onSelectDate(day.iso)}
            style={{
              backgroundColor: cellBg(day),
              borderTopColor: day.isSelected ? color.navy : 'transparent',
              cursor: day.inMonth ? 'pointer' : 'default',
            }}
          >
            <DayNumberRow>
              <DayNumber style={{ color: numberColor(day) }}>{day.num}</DayNumber>
              {day.isToday && <TodayBadge>오늘</TodayBadge>}
            </DayNumberRow>
            {day.hasMeal && <Preview>{day.preview}</Preview>}
            {day.needsMeal && <NeedsMeal>비어 있음</NeedsMeal>}
          </DayCell>
        ))}
      </Grid>

      <Legend>
        <LegendItem>
          <LegendSwatch style={{ backgroundColor: color.navySoft, borderColor: color.navy }} />
          식단 등록됨
        </LegendItem>
        <LegendItem>
          <LegendSwatch style={{ backgroundColor: color.grey0, borderColor: color.grey200 }} />
          비어 있음
        </LegendItem>
        <LegendItem>
          <LegendSwatch style={{ backgroundColor: color.grey50, borderColor: color.grey150 }} />
          주말
        </LegendItem>
      </Legend>
    </Card>
  );
};

export default MealCalendar;

const Card = styled.div(({ theme }) => ({
  backgroundColor: theme.color.grey0,
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.card,
}));

const Header = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

const NavButton = styled.button(({ theme }) => ({
  flex: 'none',
  width: 34,
  height: 34,
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.bold,
  cursor: 'pointer',
}));

const MonthLabel = styled.span(({ theme }) => ({
  flex: 'none',
  fontSize: theme.fontSize.section,
  fontWeight: theme.font.weight.bold,
}));

const TextButton = styled.button(({ theme }) => ({
  flex: 'none',
  padding: '8px 12px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  cursor: 'pointer',
}));

const Spacer = styled.span({ flex: 1 });

const FilledText = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.body,
  color: theme.semantic.textMuted,
}));

const WeekdayRow = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.semantic.bgSunken,
}));

const Weekday = styled.span(({ theme }) => ({
  padding: '9px 0',
  textAlign: 'center' as const,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
  color: theme.semantic.textSecondary,
}));

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
});

const DayCell = styled.button(({ theme }) => ({
  display: 'block',
  textAlign: 'left' as const,
  minHeight: 96,
  padding: '8px 9px',
  border: 'none',
  borderRight: `1px solid ${theme.semantic.divider}`,
  borderBottom: `1px solid ${theme.semantic.divider}`,
  borderTop: '3px solid transparent',
  fontFamily: 'inherit',
}));

const DayNumberRow = styled.span({
  display: 'flex',
  alignItems: 'center',
  gap: 5,
});

const DayNumber = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.bold,
}));

const TodayBadge = styled.span(({ theme }) => ({
  padding: '1px 6px',
  borderRadius: theme.radius.label,
  backgroundColor: theme.color.brown,
  color: theme.color.grey0,
  fontSize: theme.fontSize.caption,
  fontWeight: theme.font.weight.bold,
}));

const Preview = styled.span(({ theme }) => ({
  display: 'block',
  marginTop: 5,
  fontSize: theme.fontSize.caption,
  lineHeight: 1.5,
  color: theme.semantic.textPrimary,
}));

const NeedsMeal = styled.span(({ theme }) => ({
  display: 'block',
  marginTop: 5,
  fontSize: theme.fontSize.caption,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
}));

const Legend = styled.div(({ theme }) => ({
  display: 'flex',
  gap: 16,
  padding: '12px 18px',
  fontSize: theme.fontSize.small,
  color: theme.semantic.textMuted,
}));

const LegendItem = styled.span({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
});

const LegendSwatch = styled.span({
  width: 11,
  height: 11,
  border: '1px solid',
});
