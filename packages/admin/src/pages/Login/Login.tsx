import styled from '@emotion/styled';
import { useLoaderData } from 'react-router';

const Login = () => {
  const data = useLoaderData<{ error: string } | null>();
  const kakaoAuthorizeUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;

  return (
    <Page>
      <Blob />

      <HeaderRow>
        <Logo src="/logo.svg" alt="우리복지관" />
        <HeaderLabel>우리 복지관</HeaderLabel>
        <HeaderBadge>관리</HeaderBadge>
      </HeaderRow>

      <Hero>
        <Illust src="/start-illust.png" alt="복지관 앞에 선 두 어르신" />

        <Tagline>매일 가까이, 든든하게</Tagline>

        <Title>
          복지관 소식을
          <br />
          여기서 관리합니다
        </Title>

        <Description>
          공지와 식단을 올리면 회원 앱에 바로 나타납니다.
          <br />
          강좌 신청 수락, 회원 확인, 대화방 관리를 한곳에서 합니다.
        </Description>

        <ActionWrap>
          <KakaoButton href={kakaoAuthorizeUrl}>
            <KakaoIcon src="/kakao-symbol.png" alt="" />
            카카오 계정으로 로그인
          </KakaoButton>

          {data?.error && (
            <ErrorBox>
              <ErrorTitle>로그인 실패</ErrorTitle>
              <ErrorDescription>{data.error}</ErrorDescription>
            </ErrorBox>
          )}

          <ContactRow>
            <Notice>복지관 관리자를 위한 서비스입니다.</Notice>
            <ContactDivider />
            <ContactLink href="mailto:den.sjuhan.dev@gmail.com">권한 배정 문의</ContactLink>
          </ContactRow>
        </ActionWrap>
      </Hero>
    </Page>
  );
};

export default Login;

const Page = styled.div(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  overflow: 'hidden',
  backgroundColor: theme.color.brownTint,
  color: theme.semantic.textPrimary,
  fontFamily: theme.font.family,
  fontSize: 15,
  wordBreak: 'keep-all',
}));

const Blob = styled.div(({ theme }) => ({
  position: 'absolute',
  right: -260,
  top: -420,
  width: 900,
  height: 900,
  borderRadius: '50%',
  backgroundColor: theme.color.brownSoft,
}));

const HeaderRow = styled.div({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 11,
  padding: '34px 48px 0',
});

const Logo = styled.img(({ theme }) => ({
  flex: 'none',
  width: 32,
  height: 32,
  borderRadius: theme.radius.badge,
}));

const HeaderLabel = styled.span(({ theme }) => ({
  fontSize: 18,
  fontWeight: theme.font.weight.bold,
  letterSpacing: '-0.02em',
  color: theme.semantic.actionBg,
}));

const HeaderBadge = styled.span(({ theme }) => ({
  padding: '3px 9px',
  borderRadius: theme.radius.label,
  backgroundColor: theme.color.brownSoft,
  color: theme.semantic.actionBg,
  fontSize: 12.5,
  fontWeight: theme.font.weight.bold,
}));

const Hero = styled.div({
  position: 'relative',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 48px 40px',
  textAlign: 'center',
});

const Illust = styled.img({
  width: 330,
  height: 'auto',
});

const Tagline = styled.div(({ theme }) => ({
  fontSize: 15,
  fontWeight: theme.font.weight.bold,
  color: theme.semantic.urgent,
  marginTop: 30,
}));

const Title = styled.div(({ theme }) => ({
  fontSize: 34,
  fontWeight: theme.font.weight.bold,
  lineHeight: 1.3,
  letterSpacing: '-0.03em',
  marginTop: 10,
}));

const Description = styled.div(({ theme }) => ({
  fontSize: 15,
  fontWeight: theme.font.weight.medium,
  lineHeight: 1.8,
  marginTop: 16,
  color: theme.semantic.textSecondary,
}));

const ActionWrap = styled.div({
  width: '100%',
  maxWidth: 400,
  marginTop: 34,
});

// 카카오 로그인 버튼의 공식 브랜드 색상(디자인 토큰과는 무관, 카카오 자체 규정값)
const KAKAO_YELLOW = '#fee500';
const KAKAO_TEXT = '#272403';

const KakaoButton = styled.a(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  width: '100%',
  height: 58,
  borderRadius: 16,
  backgroundColor: KAKAO_YELLOW,
  color: KAKAO_TEXT,
  fontSize: theme.fontSize.title,
  fontWeight: theme.font.weight.bold,
  letterSpacing: '-0.02em',
  textDecoration: 'none',
  cursor: 'pointer',
  boxShadow: '0 6px 18px rgba(201,168,33,0.16)',
}));

const KakaoIcon = styled.img({
  flex: 'none',
  width: 21,
  height: 'auto',
});

const ErrorBox = styled.div(({ theme }) => ({
  marginTop: 14,
  padding: '14px 15px',
  borderRadius: 9,
  backgroundColor: theme.color.alertTint,
  border: `1px solid ${theme.color.alertLine}`,
  textAlign: 'left',
}));

const ErrorTitle = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.bold,
  color: theme.color.alertText,
}));

const ErrorDescription = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.small,
  lineHeight: 1.7,
  color: theme.color.alertText,
  marginTop: 6,
}));

const ContactRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  marginTop: 16,
});

const ContactDivider = styled.span(({ theme }) => ({
  width: 1,
  height: 12,
  backgroundColor: theme.semantic.divider,
}));

const Notice = styled.div(({ theme }) => ({
  fontSize: 13.5,
  color: theme.semantic.textSecondary,
}));

const ContactLink = styled.a(({ theme }) => ({
  fontSize: 13.5,
  fontWeight: theme.font.weight.bold,
  color: theme.semantic.actionBg,
  textDecoration: 'none',
}));
