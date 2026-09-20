import { useState } from 'react';
import type { Theme } from '@emotion/react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router';
import useLogout from '../hooks/useLogout';
import useMyMembership from '../hooks/useMyMembership';
import useGetUserInfo from '../hooks/api/user/useGetUserInfo';

const ROLE_LABEL: Record<'admin' | 'super', string> = {
  admin: '관리자',
  super: '슈퍼관리자',
};

const NAV = [
  { id: 'home', name: '대시보드', path: '/' },
  { id: 'info', name: '복지관 정보와 QR', path: '/info' },
  { id: 'notices', name: '공지 관리', path: '/notices' },
  { id: 'members', name: '회원 관리', path: '/members' },
  { id: 'courses', name: '강좌 관리', path: '/courses' },
  { id: 'rooms', name: '대화방 관리', path: '/rooms' },
  { id: 'meals', name: '오늘의 밥', path: '/meals' },
  { id: 'lost', name: '분실물 관리', path: '/lost' },
];

const Sidebar = () => {
  const [accountOpen, setAccountOpen] = useState(false);
  const { data: userInfo } = useGetUserInfo();
  const { data: membership } = useMyMembership();
  const logout = useLogout();

  const userName = userInfo?.data.userName ?? '';
  const roleLabel = membership && ROLE_LABEL[membership.role as 'admin' | 'super'];

  return (
    <Container>
      <Brand>
        <Logo>복지</Logo>
        <BrandText>
          <WelfareName>{membership?.welfare.name}</WelfareName>
          <StaffName>{userName}</StaffName>
        </BrandText>
      </Brand>

      <Nav>
        {NAV.map(item => (
          <NavItem
            key={item.id}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }: { isActive: boolean }) => ({
              borderLeftColor: isActive ? '#fff' : 'transparent',
              backgroundColor: isActive ? 'rgba(255,255,255,.08)' : 'transparent',
              fontWeight: isActive ? 700 : 400,
            })}
          >
            {item.name}
          </NavItem>
        ))}
      </Nav>

      <AccountArea>
        <AccountButton onClick={() => setAccountOpen(open => !open)}>
          <Avatar>{userName.at(0)}</Avatar>
          <AccountText>
            <StaffFullName>{userName}</StaffFullName>
            <StaffRole>{roleLabel}</StaffRole>
          </AccountText>
          <Arrow>{accountOpen ? '▲' : '▼'}</Arrow>
        </AccountButton>

        {accountOpen && (
          <AccountMenu>
            <AccountMenuButton>복지관 정보 보기</AccountMenuButton>
            <AccountMenuButton>연결된 카카오 계정</AccountMenuButton>
            <LogoutMenuButton onClick={logout}>로그아웃</LogoutMenuButton>
          </AccountMenu>
        )}
      </AccountArea>
    </Container>
  );
};

export default Sidebar;

const Container = styled.div(({ theme }) => ({
  flex: 'none',
  width: 236,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.color.navy,
  color: theme.color.grey0,
}));

const Brand = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '20px 18px 18px',
  borderBottom: '1px solid rgba(255,255,255,.16)',
});

const Logo = styled.span(({ theme }) => ({
  flex: 'none',
  width: 34,
  height: 34,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  color: theme.color.navy,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.bold,
}));

const BrandText = styled.div({
  flex: 1,
  minWidth: 0,
});

const WelfareName = styled.span(({ theme }) => ({
  display: 'block',
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.bold,
}));

const StaffName = styled.span({
  display: 'block',
  fontSize: 12,
  color: 'rgba(255,255,255,.66)',
  marginTop: 2,
});

const Nav = styled.div({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: '10px 0',
});

const NavItem = styled(NavLink)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  textAlign: 'left' as const,
  padding: '11px 18px',
  border: 'none',
  borderLeft: '3px solid transparent',
  fontSize: theme.fontSize.bodyStrong,
  color: theme.color.grey0,
  textDecoration: 'none',
  cursor: 'pointer',
}));

const AccountArea = styled.div({
  flex: 'none',
  padding: '12px 14px',
  borderTop: '1px solid rgba(255,255,255,.16)',
});

const AccountButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  textAlign: 'left',
  padding: '9px 8px',
  border: 'none',
  borderRadius: 6,
  background: 'transparent',
  color: '#fff',
  cursor: 'pointer',
});

const Avatar = styled.span(({ theme }) => ({
  flex: 'none',
  width: 30,
  height: 30,
  borderRadius: theme.radius.input,
  backgroundColor: 'rgba(255,255,255,.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
}));

const AccountText = styled.span({
  flex: 1,
  minWidth: 0,
});

const StaffFullName = styled.span(({ theme }) => ({
  display: 'block',
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
}));

const StaffRole = styled.span({
  display: 'block',
  fontSize: 11.5,
  color: 'rgba(255,255,255,.62)',
  marginTop: 1,
});

const Arrow = styled.span({
  flex: 'none',
  fontSize: 12,
  color: 'rgba(255,255,255,.72)',
});

const AccountMenu = styled.div({
  marginTop: 7,
  padding: 5,
  backgroundColor: 'rgba(255,255,255,.1)',
  borderRadius: 6,
});

const AccountMenuButton = styled.button(({ theme }) => ({
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '9px 10px',
  border: 'none',
  borderRadius: 5,
  background: 'transparent',
  color: '#fff',
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.medium,
  cursor: 'pointer',
}));

const LogoutMenuButton = styled(AccountMenuButton)(({ theme }: { theme: Theme }) => ({
  color: '#e8b0a0', // 프로토타입 실측값(oklch(0.86 0.07 32)), 어두운 사이드바 위에서만 쓰는 값이라 공유 토큰엔 없음
  fontWeight: theme.font.weight.bold,
}));
