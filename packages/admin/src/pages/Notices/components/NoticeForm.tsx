import { useState } from 'react';
import styled from '@emotion/styled';
import Card from '../../../components/ui/Card';
import CardHeader from '../../../components/ui/CardHeader';
import PrimaryButton from '../../../components/ui/PrimaryButton';
import SecondaryButton from '../../../components/ui/SecondaryButton';

type Target = { id: string; label: string };

type Props = {
  isEditing: boolean;
  initialText: string;
  targetRoomId: string;
  targets: Target[];
  onSelectRoom: (roomId: string) => void;
  onSubmit: (text: string) => void;
  onCancel: () => void;
  isSaving: boolean;
  errorMessage: string | null;
};

const NoticeForm = ({ isEditing, initialText, targetRoomId, targets, onSelectRoom, onSubmit, onCancel, isSaving, errorMessage }: Props) => {
  const [noticeText, setNoticeText] = useState(initialText);

  const handleSubmit = () => {
    if (!noticeText.trim()) return;
    onSubmit(noticeText);
  };

  return (
    <Card>
      <CardHeader>{isEditing ? '공지 수정' : '공지 등록'}</CardHeader>
      <Form>
        <Select value={targetRoomId} onChange={e => onSelectRoom(e.target.value)} disabled={isEditing}>
          {targets.map(target => (
            <option key={target.id} value={target.id}>
              {target.label}
            </option>
          ))}
        </Select>
        <Textarea value={noticeText} onChange={e => setNoticeText(e.target.value)} placeholder="공지 내용" />
        <PrimaryButton onClick={handleSubmit} disabled={isSaving || !noticeText.trim() || !targetRoomId}>
          {isSaving ? '저장 중...' : isEditing ? '수정 저장' : '등록하고 발송'}
        </PrimaryButton>
        {isEditing && <SecondaryButton onClick={onCancel}>수정 취소</SecondaryButton>}
      </Form>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </Card>
  );
};

export default NoticeForm;

const Form = styled.div({
  display: 'flex',
  gap: 10,
  alignItems: 'flex-start',
  padding: '15px 18px',
});

const Select = styled.select(({ theme }) => ({
  flex: 'none',
  width: 186,
  height: 40,
  padding: '0 10px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.medium,
  '&:disabled': { opacity: 0.6 },
}));

const Textarea = styled.textarea(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  height: 76,
  padding: '10px 12px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.medium,
  resize: 'vertical' as const,
}));

const ErrorText = styled.div(({ theme }) => ({
  padding: '0 18px 15px',
  fontSize: theme.fontSize.small,
  color: theme.color.alertText,
}));
