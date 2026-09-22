import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { MealData } from '@common/shared';
import { dateLabel, weekOf } from './mealDate';

type Props = {
  selectedDate: string;
  meals: MealData[];
  draftItems: string;
  onDraftItemsChange: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onSelectDate: (date: string) => void;
  isSaving: boolean;
  errorMessage: string | null;
};

const MealDetailPanel = ({ selectedDate, meals, draftItems, onDraftItemsChange, onSave, onDelete, onSelectDate, isSaving, errorMessage }: Props) => {
  const mealsByDate = new Map(meals.map(meal => [meal.date, meal]));
  const selectedMeal = mealsByDate.get(selectedDate);
  const hasMeal = !!selectedMeal;
  const hasDraft = draftItems.trim().length > 0;
  const week = weekOf(selectedDate);

  return (
    <Card>
      <Header>
        <DateLabel>{dateLabel(selectedDate)}</DateLabel>
        {hasMeal ? <RegisteredTag>등록됨</RegisteredTag> : <EmptyTag>비어 있음</EmptyTag>}
      </Header>

      <Body>
        <FieldLabel>식단 (한 줄에 하나)</FieldLabel>
        <Textarea value={draftItems} onChange={e => onDraftItemsChange(e.target.value)} placeholder={'쌀밥\n소고기 미역국\n고등어구이'} />
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

        <ButtonRow>
          <SaveButton disabled={!hasDraft || isSaving} onClick={onSave}>
            {isSaving ? '저장 중...' : hasMeal ? '수정 저장' : '이 날짜에 등록'}
          </SaveButton>
          {hasMeal && <DeleteButton onClick={onDelete}>삭제</DeleteButton>}
        </ButtonRow>

        <Note>등록한 식단은 그날 아침 회원 앱의 오늘의 밥 배너와 달력에 나옵니다.</Note>

        <WeekSection>
          <WeekTitle>이번 주 식단</WeekTitle>
          {week.map(iso => {
            const meal = mealsByDate.get(iso);
            const Row = iso === selectedDate ? ActiveWeekRow : WeekRow;

            return (
              <Row key={iso} onClick={() => onSelectDate(iso)}>
                <WeekDay>{dateLabel(iso)}</WeekDay>
                <WeekText>{meal ? meal.items.join(', ') : '비어 있음'}</WeekText>
              </Row>
            );
          })}
        </WeekSection>
      </Body>
    </Card>
  );
};

export default MealDetailPanel;

const Card = styled.div(({ theme }) => ({
  backgroundColor: theme.color.grey0,
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.card,
}));

const Header = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '15px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

const DateLabel = styled.span(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  fontSize: theme.fontSize.title,
  fontWeight: theme.font.weight.bold,
}));

const Tag = styled.span(({ theme }) => ({
  flex: 'none',
  padding: '3px 8px',
  borderRadius: theme.radius.label,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
}));

const RegisteredTag = styled(Tag)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.color.navySoft,
  color: theme.color.navyDeep,
}));

const EmptyTag = styled(Tag)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.color.grey150,
  color: theme.semantic.textMuted,
}));

const Body = styled.div({
  padding: '16px 18px 18px',
});

const FieldLabel = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
  marginBottom: 5,
}));

const Textarea = styled.textarea(({ theme }) => ({
  width: '100%',
  height: 196,
  padding: '10px 12px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.medium,
  lineHeight: 1.7,
  fontFamily: 'inherit',
  resize: 'vertical' as const,
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

const SaveButton = styled.button(({ theme }) => ({
  padding: '10px 16px',
  border: 'none',
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.navy,
  color: theme.color.grey0,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.bold,
  cursor: 'pointer',
  '&:disabled': {
    backgroundColor: theme.color.grey150,
    color: theme.semantic.textMuted,
    cursor: 'default',
  },
}));

const DeleteButton = styled.button(({ theme }) => ({
  padding: '10px 16px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  color: theme.color.alertText,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.semibold,
  cursor: 'pointer',
}));

const Note = styled.div(({ theme }) => ({
  marginTop: 14,
  padding: '12px 14px',
  backgroundColor: theme.semantic.bgSunken,
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  fontSize: theme.fontSize.small,
  lineHeight: 1.7,
  color: theme.semantic.textSecondary,
}));

const WeekSection = styled.div({
  marginTop: 16,
});

const WeekTitle = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
  color: theme.semantic.textSecondary,
  marginBottom: 8,
}));

const WeekRow = styled.button(({ theme }) => ({
  display: 'flex',
  gap: 10,
  width: '100%',
  textAlign: 'left' as const,
  padding: '9px 10px',
  marginBottom: 6,
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  cursor: 'pointer',
}));

const ActiveWeekRow = styled(WeekRow)(({ theme }: { theme: Theme }) => ({
  borderColor: theme.color.navy,
  backgroundColor: theme.color.navyTint,
}));

const WeekDay = styled.span(({ theme }) => ({
  flex: 'none',
  width: 52,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
}));

const WeekText = styled.span(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  fontSize: theme.fontSize.small,
  color: theme.semantic.textSecondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const,
}));
