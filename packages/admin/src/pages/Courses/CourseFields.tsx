import styled from '@emotion/styled';
import type { ScheduleItem, Weekday } from '@common/shared';
import type { TeacherOption } from '../../hooks/useTeacherOptions';
import { WEEKDAY_ORDER, WEEKDAY_LABEL } from './courseDisplay';
import TimeSelect from './TimeSelect';

export type CourseFieldValues = {
  name: string;
  schedule: ScheduleItem[];
  place: string;
  teacher: string;
  cap: string;
  from: string;
  to: string;
};

type FieldKey = Exclude<keyof CourseFieldValues, 'schedule'>;

type Props = {
  values: CourseFieldValues;
  onChange: (key: FieldKey, value: string) => void;
  onToggleDay: (day: Weekday) => void;
  onScheduleTimeChange: (day: Weekday, field: 'startTime' | 'endTime', time: string) => void;
  teacherOptions: TeacherOption[];
};

const CourseFields = ({ values, onChange, onToggleDay, onScheduleTimeChange, teacherOptions }: Props) => {
  const periodInvalid = !!values.from && !!values.to && values.to < values.from;
  const sortedSchedule = [...values.schedule].sort((a, b) => WEEKDAY_ORDER.indexOf(a.day) - WEEKDAY_ORDER.indexOf(b.day));

  return (
    <Grid>
      <Field>
        <Label>강좌명</Label>
        <Input value={values.name} onChange={e => onChange('name', e.target.value)} placeholder="노래교실" />
      </Field>
      <Field>
        <Label>장소</Label>
        <Input value={values.place} onChange={e => onChange('place', e.target.value)} placeholder="3층 대강당" />
      </Field>
      <Field>
        <Label>선생님</Label>
        <Select value={values.teacher} onChange={e => onChange('teacher', e.target.value)}>
          {teacherOptions.map(option => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <Label>정원</Label>
        <Input value={values.cap} onChange={e => onChange('cap', e.target.value)} placeholder="30" />
      </Field>

      <WideField>
        <Label>요일과 시간</Label>
        <WeekdayChips>
          {WEEKDAY_ORDER.map(day => (
            <WeekdayChip key={day} type="button" selected={values.schedule.some(s => s.day === day)} onClick={() => onToggleDay(day)}>
              {WEEKDAY_LABEL[day]}
            </WeekdayChip>
          ))}
        </WeekdayChips>

        {sortedSchedule.length > 0 && (
          <ScheduleList>
            {sortedSchedule.map(item => {
              const timeInvalid = item.endTime <= item.startTime;
              return (
                <ScheduleRow key={item.day}>
                  <ScheduleDay>{WEEKDAY_LABEL[item.day]}요일</ScheduleDay>
                  <TimeSelect value={item.startTime} onChange={time => onScheduleTimeChange(item.day, 'startTime', time)} />
                  <Tilde>~</Tilde>
                  <TimeSelect value={item.endTime} onChange={time => onScheduleTimeChange(item.day, 'endTime', time)} />
                  {timeInvalid && <ScheduleErrorText>종료 시간이 시작 시간보다 빠릅니다</ScheduleErrorText>}
                </ScheduleRow>
              );
            })}
          </ScheduleList>
        )}
      </WideField>

      <WideField>
        <Label>운영 기간</Label>
        <PeriodRow>
          <Input type="date" value={values.from} max={values.to || undefined} onChange={e => onChange('from', e.target.value)} />
          <Tilde>~</Tilde>
          <Input type="date" value={values.to} min={values.from || undefined} onChange={e => onChange('to', e.target.value)} />
        </PeriodRow>
        {periodInvalid && <ErrorText>종료일은 시작일 이후여야 합니다</ErrorText>}
      </WideField>
    </Grid>
  );
};

export default CourseFields;

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 12,
});

const Field = styled.div({});

const WideField = styled.div({ gridColumn: 'span 2' });

const Label = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
  marginBottom: 5,
}));

const Input = styled.input(({ theme }) => ({
  width: '100%',
  height: theme.hit.input,
  padding: '0 11px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.medium,
}));

const Select = styled.select(({ theme }) => ({
  width: '100%',
  height: theme.hit.input,
  padding: '0 9px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.medium,
}));

const WeekdayChips = styled.div({
  display: 'flex',
  gap: 6,
});

const WeekdayChip = styled.button<{ selected: boolean }>(({ theme, selected }) => ({
  width: 34,
  height: theme.hit.input,
  border: `1px solid ${selected ? theme.color.navy : theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: selected ? theme.color.navy : theme.color.grey0,
  color: selected ? theme.color.grey0 : theme.semantic.textSecondary,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.bold,
  cursor: 'pointer',
}));

const ScheduleList = styled.div({
  marginTop: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

const ScheduleRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '9px 12px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.semantic.bgSunken,
}));

const ScheduleDay = styled.span(({ theme }) => ({
  flex: 'none',
  width: 48,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.bold,
}));

const PeriodRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

const Tilde = styled.span(({ theme }) => ({
  color: theme.semantic.textMuted,
}));

const ErrorText = styled.div(({ theme }) => ({
  marginTop: 6,
  fontSize: theme.fontSize.small,
  color: theme.color.alertText,
}));

const ScheduleErrorText = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.small,
  color: theme.color.alertText,
}));
