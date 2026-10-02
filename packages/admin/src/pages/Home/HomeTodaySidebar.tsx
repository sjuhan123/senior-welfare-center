import { Link } from 'react-router';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { InviteCodeData } from '@common/shared';
import Card from '../../components/ui/Card';
import CardHeader from '../../components/ui/CardHeader';

type Props = {
  todayMealText: string;
  latestNoticeText: string;
  inviteCode: InviteCodeData | null;
};

const HomeTodaySidebar = ({ todayMealText, latestNoticeText, inviteCode }: Props) => {
  return (
    <Card>
      <CardHeader>오늘 회원에게 보이는 것</CardHeader>
      <Body>
        <Label>오늘의 밥</Label>
        <Value>{todayMealText}</Value>

        <Divider />

        <Label>가장 최근 공지</Label>
        <Value>{latestNoticeText}</Value>

        <Divider />

        <Label>복지관 QR</Label>
        <QrRow>
          <Value>{inviteCode ? `사용 중 · ${inviteCode.code}` : '발급된 QR이 없습니다'}</Value>
          <ViewLink to="/info">보기</ViewLink>
        </QrRow>
      </Body>
    </Card>
  );
};

export default HomeTodaySidebar;

const Body = styled.div({
  padding: '16px 18px',
});

const Label = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
}));

const Value = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.semibold,
  lineHeight: 1.6,
  marginTop: 5,
}));

const Divider = styled.div(({ theme }) => ({
  height: 1,
  backgroundColor: theme.semantic.divider,
  margin: '14px 0',
}));

const QrRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginTop: 7,
});

const ViewLink = styled(Link)(({ theme }: { theme: Theme }) => ({
  marginLeft: 'auto',
  flex: 'none',
  padding: '7px 12px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textPrimary,
  textDecoration: 'none',
}));
