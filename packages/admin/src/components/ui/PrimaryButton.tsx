import styled from '@emotion/styled';

const PrimaryButton = styled.button(({ theme }) => ({
  padding: '10px 16px',
  border: 'none',
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.navy,
  color: theme.color.grey0,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.bold,
  cursor: 'pointer',
  '&:disabled': {
    opacity: 0.6,
    cursor: 'default',
  },
}));

export default PrimaryButton;
