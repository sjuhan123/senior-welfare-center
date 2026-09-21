import { useState } from 'react';
import styled from '@emotion/styled';
import type { WelfareData } from '@common/shared';
import Card from '../../components/ui/Card';
import CardHeader from '../../components/ui/CardHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import useUpdateWelfare, { type WelfareUpdateFields } from '../../hooks/api/welfare/useUpdateWelfare';
import { getPatchErrorMessage } from '../../hooks/useOptimisticPatch';

const FIELDS: { key: keyof WelfareUpdateFields; label: string }[] = [
  { key: 'name', label: '복지관명' },
  { key: 'address', label: '주소' },
  { key: 'phone', label: '전화번호' },
  { key: 'homepage', label: '홈페이지' },
  { key: 'remarks', label: '비고' },
];

const toFields = (welfare: WelfareData): WelfareUpdateFields => ({
  name: welfare.name,
  address: welfare.address,
  phone: welfare.phone,
  homepage: welfare.homepage,
  remarks: welfare.remarks ?? '',
});

const WelfareInfoCard = ({ welfareId, welfare }: { welfareId: string; welfare: WelfareData }) => {
  const [fields, setFields] = useState<WelfareUpdateFields>(() => toFields(welfare));
  const [mode, setMode] = useState<'viewing' | 'editing'>('viewing');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutate: updateWelfare, isPending, isSuccess, error, reset } = useUpdateWelfare(welfareId);

  const handleChange = (key: keyof WelfareUpdateFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleRevert = () => {
    setFields(toFields(welfare));
    setMode('viewing');
  };

  const handleDialogClose = () => {
    setConfirmOpen(false);
    setMode('viewing');
    reset();
  };

  return (
    <Card>
      <CardHeader>복지관 정보</CardHeader>
      <CardBody>
        {FIELDS.map(field => (
          <FieldRow key={field.key}>
            <FieldLabel>{field.label}</FieldLabel>
            <FieldInput value={fields[field.key]} onChange={handleChange(field.key)} disabled={mode === 'viewing'} />
          </FieldRow>
        ))}
        <ButtonRow>
          {mode === 'viewing' ? (
            <PrimaryButton onClick={() => setMode('editing')}>수정</PrimaryButton>
          ) : (
            <>
              <PrimaryButton onClick={() => setConfirmOpen(true)}>저장</PrimaryButton>
              <SecondaryButton onClick={handleRevert}>되돌리기</SecondaryButton>
            </>
          )}
        </ButtonRow>
      </CardBody>

      <ConfirmDialog
        open={confirmOpen}
        title="정말 저장하시겠습니까?"
        successMessage="저장되었습니다"
        errorMessage={error ? getPatchErrorMessage(error) : null}
        isPending={isPending}
        isSuccess={isSuccess}
        onConfirm={() => updateWelfare({ ...fields, updatedAt: welfare.updatedAt })}
        onCancel={() => setConfirmOpen(false)}
        onClose={handleDialogClose}
      />
    </Card>
  );
};

export default WelfareInfoCard;

const CardBody = styled.div({
  padding: '6px 18px 16px',
});

const FieldRow = styled.div(({ theme }) => ({
  display: 'flex',
  gap: 14,
  padding: '13px 0',
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

const FieldLabel = styled.span(({ theme }) => ({
  flex: 'none',
  width: 96,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
  paddingTop: 8,
}));

const FieldInput = styled.input(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  height: theme.hit.input,
  padding: '0 11px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.medium,
  '&:disabled': {
    backgroundColor: theme.color.grey50,
    color: theme.semantic.textMuted,
  },
}));

const ButtonRow = styled.div({
  display: 'flex',
  gap: 9,
  marginTop: 16,
});
