import { useState } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { Weekday } from '@common/shared';
import Card from '../../../components/ui/Card';
import CardHeader from '../../../components/ui/CardHeader';
import PrimaryButton from '../../../components/ui/PrimaryButton';
import SecondaryButton from '../../../components/ui/SecondaryButton';
import type { TeacherOption } from '../../../hooks/useTeacherOptions';
import type { CreateCourseFields } from '../../../hooks/api/course/useCreateCourse';
import CourseFields, { type CourseFieldValues } from './CourseFields';
import TimeSelect from '../../../components/ui/TimeSelect';
import { isScheduleValid } from '../courseDisplay';

const EMPTY_FIELDS: CourseFieldValues = { name: '', schedule: [], place: '', teacher: '', cap: '', from: '', to: '' };

type Room = 'chat' | 'feed';

const ROOM_OPTIONS: { id: Room; name: string; desc: string }[] = [
  { id: 'chat', name: '이야기방', desc: '선생님과 회원이 함께 이야기하는 방' },
  { id: 'feed', name: '사진방', desc: '수업 사진을 올리고 댓글을 다는 방' },
];

type Props = {
  teacherOptions: TeacherOption[];
  onSubmit: (fields: CreateCourseFields) => void;
  onCancel: () => void;
  isSaving: boolean;
  errorMessage: string | null;
};

const CourseRegisterForm = ({ teacherOptions, onSubmit, onCancel, isSaving, errorMessage }: Props) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [fields, setFields] = useState<CourseFieldValues>(EMPTY_FIELDS);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');

  const handleFieldChange = (key: Exclude<keyof CourseFieldValues, 'schedule'>, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleDay = (day: Weekday) => {
    setFields(prev => ({
      ...prev,
      schedule: prev.schedule.some(s => s.day === day)
        ? prev.schedule.filter(s => s.day !== day)
        : [...prev.schedule, { day, startTime: '09:00', endTime: '10:00' }],
    }));
  };

  const handleScheduleTimeChange = (day: Weekday, field: 'startTime' | 'endTime', time: string) => {
    setFields(prev => ({ ...prev, schedule: prev.schedule.map(s => (s.day === day ? { ...s, [field]: time } : s)) }));
  };

  const toggleRoom = (room: Room) => {
    setRooms(prev => (prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]));
  };

  const canGoStep2 = fields.name.trim().length > 0;
  const periodValid = !fields.from || !fields.to || fields.to >= fields.from;
  const scheduleValid = isScheduleValid(fields.schedule);

  const handleSubmit = () => {
    if (!periodValid || !scheduleValid) return;
    onSubmit({ ...fields, rooms, availableFrom, availableTo });
  };

  return (
    <Wrapper>
      <CardHeader>
        <HeaderRow>
          <HeaderTitle>강좌 등록</HeaderTitle>
          <StepLabel>{step} / 2단계</StepLabel>
          <SecondaryButton onClick={onCancel}>닫기</SecondaryButton>
        </HeaderRow>
      </CardHeader>

      <StepBar>
        <StepMark active={step >= 1}>강좌 정보</StepMark>
        <StepMark active={step >= 2}>대화방 만들기</StepMark>
      </StepBar>

      {step === 1 && (
        <Body>
          <CourseFields
            values={fields}
            onChange={handleFieldChange}
            onToggleDay={handleToggleDay}
            onScheduleTimeChange={handleScheduleTimeChange}
            teacherOptions={teacherOptions}
          />
          <ButtonRow>
            <PrimaryButton disabled={!canGoStep2} onClick={() => setStep(2)}>
              다음: 대화방 만들기
            </PrimaryButton>
          </ButtonRow>
        </Body>
      )}

      {step === 2 && (
        <Body>
          <Description>
            <b>{fields.name || '이 강좌'}</b>에 필요한 대화방을 함께 만듭니다. 공지방은 반드시 있어야 하므로 끌 수 없습니다.
          </Description>

          <RoomRow>
            <Checkbox checked disabled>
              ✓
            </Checkbox>
            <RoomInfo>
              <RoomName>공지방</RoomName>
              <RoomDesc>관리자와 선생님이 알림을 보내는 방</RoomDesc>
            </RoomInfo>
            <LockedTag>필수</LockedTag>
          </RoomRow>

          {ROOM_OPTIONS.map(room => {
            const on = rooms.includes(room.id);
            return (
              <RoomRow key={room.id} onClick={() => toggleRoom(room.id)}>
                <Checkbox checked={on}>{on ? '✓' : ''}</Checkbox>
                <RoomInfo>
                  <RoomName>{room.name}</RoomName>
                  <RoomDesc>{room.desc}</RoomDesc>
                </RoomInfo>
              </RoomRow>
            );
          })}

          <TimeRow>
            <TimeLabel>이야기방 이용 시간</TimeLabel>
            <TimeSelect value={availableFrom} onChange={setAvailableFrom} />
            <span>부터</span>
            <TimeSelect value={availableTo} onChange={setAvailableTo} />
            <span>까지</span>
          </TimeRow>

          {!periodValid && <ErrorText>운영 기간을 다시 확인해 주세요(종료일이 시작일보다 빠릅니다)</ErrorText>}
          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

          <ButtonRow>
            <PrimaryButton disabled={isSaving || !periodValid || !scheduleValid} onClick={handleSubmit}>
              {isSaving ? '만드는 중...' : '강좌와 대화방 만들기'}
            </PrimaryButton>
            <SecondaryButton onClick={() => setStep(1)}>이전</SecondaryButton>
          </ButtonRow>
        </Body>
      )}
    </Wrapper>
  );
};

export default CourseRegisterForm;

const Wrapper = styled(Card)(({ theme }: { theme: Theme }) => ({
  border: `1px solid ${theme.color.navy}`,
  marginBottom: 16,
}));

const HeaderRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

const HeaderTitle = styled.span({ flex: 1 });

const StepLabel = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
}));

const StepBar = styled.div({
  display: 'flex',
  gap: 0,
  padding: '14px 18px 0',
});

const StepMark = styled.span<{ active: boolean }>(({ theme, active }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 7,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
  color: active ? theme.color.navyDeep : theme.semantic.textMuted,
  '&::before': {
    content: '""',
    display: 'block',
    height: 4,
    borderRadius: 2,
    backgroundColor: active ? theme.color.navy : theme.semantic.border,
  },
}));

const Body = styled.div({
  padding: '16px 18px 18px',
});

const Description = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.bodyStrong,
  lineHeight: 1.7,
  color: theme.semantic.textSecondary,
  marginBottom: 13,
}));

const RoomRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 13,
  padding: '13px 15px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  marginBottom: 9,
  cursor: 'pointer',
}));

const Checkbox = styled.button<{ checked: boolean }>(({ theme, checked }) => ({
  flex: 'none',
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `2px solid ${checked ? theme.color.navy : theme.semantic.border}`,
  borderRadius: theme.radius.label,
  backgroundColor: checked ? theme.color.navy : theme.color.grey0,
  color: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.bold,
  cursor: 'inherit',
}));

const RoomInfo = styled.div({ flex: 1, minWidth: 0 });

const RoomName = styled.span(({ theme }) => ({
  display: 'block',
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.bold,
}));

const RoomDesc = styled.span(({ theme }) => ({
  display: 'block',
  marginTop: 3,
  fontSize: theme.fontSize.small,
  color: theme.semantic.textMuted,
}));

const LockedTag = styled.span(({ theme }) => ({
  flex: 'none',
  padding: '3px 8px',
  borderRadius: theme.radius.label,
  backgroundColor: theme.color.navySoft,
  color: theme.color.navyDeep,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
}));

const TimeRow = styled.div(({ theme }) => ({
  display: 'flex',
  gap: 14,
  alignItems: 'center',
  padding: '13px 15px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.semantic.bgSunken,
  fontSize: theme.fontSize.body,
  color: theme.semantic.textMuted,
}));

const TimeLabel = styled.span(({ theme }) => ({
  flex: 'none',
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textSecondary,
}));

const ErrorText = styled.div(({ theme }) => ({
  marginTop: 8,
  fontSize: theme.fontSize.small,
  color: theme.color.alertText,
}));

const ButtonRow = styled.div({
  display: 'flex',
  gap: 9,
  marginTop: 16,
});
