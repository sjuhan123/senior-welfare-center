import styled from '@emotion/styled';

const SecondaryButton = styled.button(({ theme }) => ({
  padding: '10px 16px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.semibold,
  cursor: 'pointer',
}));

export default SecondaryButton;
