import styled from '@emotion/styled';
import type { Weekday } from '@common/shared';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import type { TeacherOption } from '../../hooks/useTeacherOptions';
import CourseFields, { type CourseFieldValues } from './CourseFields';
import { isScheduleValid } from './courseDisplay';

type FieldKey = Exclude<keyof CourseFieldValues, 'schedule'>;

type Props = {
  values: CourseFieldValues;
  onFieldChange: (key: FieldKey, value: string) => void;
  onToggleDay: (day: Weekday) => void;
  onScheduleTimeChange: (day: Weekday, field: 'startTime' | 'endTime', time: string) => void;
  teacherOptions: TeacherOption[];
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  errorMessage: string | null;
};

const CourseEditForm = ({
  values,
  onFieldChange,
  onToggleDay,
  onScheduleTimeChange,
  teacherOptions,
  onSave,
  onCancel,
  isSaving,
  errorMessage,
}: Props) => {
  const periodValid = !values.from || !values.to || values.to >= values.from;
  const canSave = values.name.trim().length > 0 && periodValid && isScheduleValid(values.schedule);

  return (
    <Wrapper>
      <CourseFields
        values={values}
        onChange={onFieldChange}
        onToggleDay={onToggleDay}
        onScheduleTimeChange={onScheduleTimeChange}
        teacherOptions={teacherOptions}
      />

      <Note>
        <b>끝나는 날이 지나면</b> 강좌가 자동으로 종료됩니다. 연결된 대화방이 사라지고 수강 회원은 모두 탈퇴 처리됩니다. 공지와 사진 기록은 3개월간
        보관합니다.
      </Note>

      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

      <ButtonRow>
        <PrimaryButton disabled={!canSave || isSaving} onClick={onSave}>
          {isSaving ? '저장 중...' : '수정 저장'}
        </PrimaryButton>
        <SecondaryButton onClick={onCancel}>취소</SecondaryButton>
      </ButtonRow>
    </Wrapper>
  );
};

export default CourseEditForm;

const Wrapper = styled.div(({ theme }) => ({
  padding: '16px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.color.navyTint,
}));

const Note = styled.div(({ theme }) => ({
  marginTop: 12,
  padding: '11px 13px',
  backgroundColor: theme.color.grey0,
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  fontSize: theme.fontSize.small,
  lineHeight: 1.7,
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
  marginTop: 14,
});
