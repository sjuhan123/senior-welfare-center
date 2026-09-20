import { useEffect } from 'react';
import styled from '@emotion/styled';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  successMessage: string;
  isPending: boolean;
  isSuccess: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
};

const SUCCESS_AUTO_CLOSE_MS = 1200;

const ConfirmDialog = ({ open, title, successMessage, isPending, isSuccess, onConfirm, onCancel, onClose }: ConfirmDialogProps) => {
  useEffect(() => {
    if (!isSuccess) return;

    const timer = setTimeout(onClose, SUCCESS_AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [isSuccess, onClose]);

  if (!open) return null;

  return (
    <Overlay>
      <Box>
        {isSuccess ? (
          <SuccessMessage>{successMessage}</SuccessMessage>
        ) : (
          <>
            <Title>{title}</Title>
            <ButtonRow>
              <SecondaryButton onClick={onCancel} disabled={isPending}>
                취소
              </SecondaryButton>
              <PrimaryButton onClick={onConfirm} disabled={isPending}>
                {isPending ? '저장 중...' : '저장'}
              </PrimaryButton>
            </ButtonRow>
          </>
        )}
      </Box>
    </Overlay>
  );
};

export default ConfirmDialog;

const Overlay = styled.div({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
});

const Box = styled.div(({ theme }) => ({
  width: 320,
  padding: '24px 22px',
  backgroundColor: theme.color.grey0,
  borderRadius: theme.radius.card,
  textAlign: 'center',
}));

const Title = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.title,
  fontWeight: theme.font.weight.bold,
  marginBottom: 18,
}));

const ButtonRow = styled.div({
  display: 'flex',
  gap: 9,
  justifyContent: 'center',
});

const SuccessMessage = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.semibold,
  color: theme.color.navy,
  padding: '8px 0',
}));
