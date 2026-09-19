import styled from '@emotion/styled';
import { useLoaderData } from 'react-router';

const Login = () => {
  const data = useLoaderData<{ error: string } | null>();
  const kakaoAuthorizeUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;

  return (
    <Page>
      <Card>
        <HeaderRow>
          <Logo src="/logo-header.png" alt="우리복지관" />
          <HeaderLabel>우리복지관 관리</HeaderLabel>
        </HeaderRow>

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

        <Divider />

        <Notice>복지관 관리자를 위한 서비스입니다.</Notice>

        <KakaoButton href={kakaoAuthorizeUrl}>카카오 계정으로 로그인</KakaoButton>

        {data?.error && (
          <ErrorBox>
            <ErrorTitle>로그인 실패</ErrorTitle>
            <ErrorDescription>{data.error}</ErrorDescription>
          </ErrorBox>
        )}

        <ContactRow>
          <ContactLink href="mailto:den.sjuhan.dev@gmail.com">권한 배정 문의</ContactLink>
        </ContactRow>
      </Card>
    </Page>
  );
};

export default Login;

const Page = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: theme.semantic.bgSunken,
  color: theme.semantic.textPrimary,
  fontFamily: theme.font.family,
  fontSize: 15,
}));

const Card = styled.div({
  width: '100%',
  maxWidth: 452,
  padding: 44,
});

const HeaderRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 11,
});

const Logo = styled.img(({ theme }) => ({
  flex: 'none',
  width: 38,
  height: 38,
  borderRadius: theme.radius.badge,
}));

const HeaderLabel = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.section,
  fontWeight: theme.font.weight.bold,
}));

const Title = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.hero,
  fontWeight: theme.font.weight.bold,
  lineHeight: 1.35,
  letterSpacing: '-0.015em',
  marginTop: 30,
}));

const Description = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.label,
  lineHeight: 1.8,
  marginTop: 14,
  color: theme.semantic.textSecondary,
}));

const Divider = styled.div(({ theme }) => ({
  height: 1,
  backgroundColor: theme.semantic.divider,
  margin: '30px 0 26px',
}));

const Notice = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.body,
  lineHeight: 1.75,
  color: theme.semantic.textMuted,
}));

const KakaoButton = styled.a(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 52,
  marginTop: 16,
  borderRadius: 9,
  backgroundColor: theme.semantic.ctaBg,
  color: theme.semantic.ctaFg,
  fontSize: theme.fontSize.title,
  fontWeight: theme.font.weight.bold,
  textDecoration: 'none',
  cursor: 'pointer',
}));

const ErrorBox = styled.div(({ theme }) => ({
  marginTop: 14,
  padding: '14px 15px',
  borderRadius: 9,
  backgroundColor: theme.color.alertTint,
  border: `1px solid ${theme.color.alertLine}`,
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
  gap: 16,
  marginTop: 16,
});

const ContactLink = styled.a(({ theme }) => ({
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textPrimary,
  textDecoration: 'none',
}));
