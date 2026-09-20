import styled from '@emotion/styled';
import { useMatches } from 'react-router';
import useLogout from '../../hooks/useLogout';

type RouteHandle = {
  title: string;
  description: string;
};

const today = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date());

const PageHeader = () => {
  const matches = useMatches();
  const match = [...matches].reverse().find(m => m.handle);
  const handle = match?.handle as RouteHandle | undefined;
  const logout = useLogout();

  return (
    <Header>
      <TitleGroup>
        <Title>{handle?.title}</Title>
        <Description>{handle?.description}</Description>
      </TitleGroup>
      <Today>{today}</Today>
      <LogoutButton onClick={logout}>로그아웃</LogoutButton>
    </Header>
  );
};

export default PageHeader;

const Header = styled.div(({ theme }) => ({
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '16px 26px',
  backgroundColor: theme.color.grey0,
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

const TitleGroup = styled.div({
  flex: 1,
  minWidth: 0,
});

const Title = styled.div(({ theme }) => ({
  fontSize: 19,
  fontWeight: theme.font.weight.bold,
}));

const Description = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.body,
  color: theme.semantic.textMuted,
  marginTop: 3,
}));

const Today = styled.span(({ theme }) => ({
  flex: 'none',
  fontSize: theme.fontSize.body,
  color: theme.semantic.textMuted,
}));

const LogoutButton = styled.button(({ theme }) => ({
  flex: 'none',
  padding: '9px 13px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  cursor: 'pointer',
}));
