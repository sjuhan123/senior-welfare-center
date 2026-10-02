import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import type { LostItemFields } from '../../hooks/api/lostItem/useCreateLostItem';

const FIELDS: { key: keyof Omit<LostItemFields, 'notifyNotice'>; label: string; hint: string }[] = [
  { key: 'item', label: '물건', hint: '검정색 우산' },
  { key: 'where', label: '찾은 곳', hint: '3층 대강당' },
  { key: 'when', label: '찾은 날', hint: '8월 29일' },
  { key: 'keep', label: '보관 장소', hint: '1층 안내실에 보관 중' },
];

type Props = {
  isEditing: boolean;
  fields: LostItemFields;
  onFieldChange: (key: keyof LostItemFields, value: string | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  errorMessage: string | null;
};

const LostForm = ({ isEditing, fields, onFieldChange, onSave, onCancel, isSaving, errorMessage }: Props) => {
  const canSave = fields.item.trim().length > 0;

  return (
    <Card>
      <CardHeader>{isEditing ? '분실물 수정' : '분실물 등록'}</CardHeader>
      <Body>
        {FIELDS.map(field => (
          <FieldRow key={field.key}>
            <FieldLabel>{field.label}</FieldLabel>
            <FieldInput value={fields[field.key]} onChange={e => onFieldChange(field.key, e.target.value)} placeholder={field.hint} />
          </FieldRow>
        ))}

        <CheckRow onClick={() => onFieldChange('notifyNotice', !fields.notifyNotice)}>
          {fields.notifyNotice ? <CheckboxChecked>✓</CheckboxChecked> : <CheckboxEmpty />}
          <span>복지관 공지방에도 알리기</span>
        </CheckRow>

        <Hint>
          {fields.notifyNotice
            ? '등록하면 앱 복지관 탭 분실물 목록에 올라가고, 복지관 공지방에도 한 줄 알림이 갑니다.'
            : '등록하면 앱 복지관 탭 분실물 목록에만 올라갑니다. 공지방 알림은 가지 않습니다.'}
        </Hint>

        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

        <ButtonRow>
          <PrimaryButton disabled={!canSave || isSaving} onClick={onSave}>
            {isSaving ? '저장 중...' : isEditing ? '수정 저장' : '등록'}
          </PrimaryButton>
          {isEditing && <SecondaryButton onClick={onCancel}>취소</SecondaryButton>}
        </ButtonRow>
      </Body>
    </Card>
  );
};

export default LostForm;

const Card = styled.div(({ theme }) => ({
  backgroundColor: theme.color.grey0,
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.card,
}));

const CardHeader = styled.div(({ theme }) => ({
  padding: '15px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  fontSize: theme.fontSize.title,
  fontWeight: theme.font.weight.bold,
}));

const Body = styled.div({
  padding: '16px 18px 18px',
});

const FieldRow = styled.div({
  marginBottom: 12,
});

const FieldLabel = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
  marginBottom: 5,
}));

const FieldInput = styled.input(({ theme }) => ({
  width: '100%',
  height: theme.hit.input,
  padding: '0 11px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.medium,
}));

const CheckRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 9,
  margin: '14px 0 4px',
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.medium,
  color: theme.semantic.textSecondary,
  cursor: 'pointer',
}));

const CheckboxEmpty = styled.span(({ theme }) => ({
  flex: 'none',
  width: 20,
  height: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `2px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.label,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.caption,
  fontWeight: theme.font.weight.bold,
}));

const CheckboxChecked = styled(CheckboxEmpty)(({ theme }: { theme: Theme }) => ({
  borderColor: theme.color.navy,
  backgroundColor: theme.color.navy,
  color: theme.color.grey0,
}));

const Hint = styled.div(({ theme }) => ({
  marginTop: 12,
  padding: '12px 14px',
  backgroundColor: theme.semantic.bgSunken,
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
