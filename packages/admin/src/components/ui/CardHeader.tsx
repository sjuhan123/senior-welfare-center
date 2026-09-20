import styled from '@emotion/styled';

const CardHeader = styled.div(({ theme }) => ({
  padding: '15px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  fontSize: theme.fontSize.title,
  fontWeight: theme.font.weight.bold,
}));

export default CardHeader;
