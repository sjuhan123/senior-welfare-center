import styled from '@emotion/styled';
import { Outlet } from 'react-router';

import Sidebar from './components/Sidebar';
import PageHeader from './components/PageHeader';

const Layout = () => {
  return (
    <Shell>
      <Sidebar />
      <Main>
        <PageHeader />
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Shell>
  );
};

export default Layout;

const Shell = styled.div(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.semantic.bgSunken,
  color: theme.semantic.textPrimary,
  fontFamily: theme.font.family,
  fontSize: 15,
}));

const Main = styled.div({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
});

const Content = styled.div({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: '22px 26px 40px',
});
