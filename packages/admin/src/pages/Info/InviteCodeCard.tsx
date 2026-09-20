import type { Theme } from '@emotion/react';
import styled from '@emotion/styled';
import { QRCodeSVG } from 'qrcode.react';
import type { InviteCodeData } from '@common/shared';
import Card from '../../components/ui/Card';
import CardHeader from '../../components/ui/CardHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import useReissueInviteCode from '../../hooks/api/welfare/useReissueInviteCode';

const InviteCodeCard = ({ welfareId, active, history }: { welfareId: string; active: InviteCodeData | null; history: InviteCodeData[] }) => {
  const { mutate: reissue, isPending } = useReissueInviteCode(welfareId);
  const invalidHistory = history.filter(code => !code.active);

  return (
    <Card>
      <CardHeader>가입용 QR</CardHeader>
      <QrBody>
        {active ? (
          <>
            <QrVisual>
              <QRCodeSVG value={active.code} size={148} />
            </QrVisual>
            <QrDetail>
              <QrTag>사용 중</QrTag>
              <QrCodeText>{active.code}</QrCodeText>
              <QrMeta>
                {new Date(active.issuedAt).toLocaleDateString('ko-KR')} 발급
                <br />
                스캔 {active.scanCount}회
              </QrMeta>
              <QrActions>
                <PrimaryButton disabled>인쇄용 안내문 열기</PrimaryButton>
                <ReissueButton onClick={() => reissue()} disabled={isPending}>
                  재발급
                </ReissueButton>
              </QrActions>
            </QrDetail>
          </>
        ) : (
          <EmptyQr>
            아직 발급된 QR이 없습니다.
            <IssueButton onClick={() => reissue()} disabled={isPending}>
              QR 발급하기
            </IssueButton>
          </EmptyQr>
        )}
      </QrBody>

      <Notice>
        <b>재발급하면 이전 QR은 그 즉시 쓸 수 없습니다.</b> 이미 인쇄해서 붙여둔 안내문이 있으면 모두 새 것으로 바꿔야 합니다. 이미 가입한 회원에게는
        영향이 없습니다.
      </Notice>

      {invalidHistory.length > 0 && (
        <OldCodeList>
          <OldCodeTitle>무효가 된 QR</OldCodeTitle>
          {invalidHistory.map(code => (
            <OldCodeRow key={code._id}>
              <OldCodeBadge>무효</OldCodeBadge>
              <OldCodeValue>{code.code}</OldCodeValue>
              <OldCodeDate>{new Date(code.issuedAt).toLocaleDateString('ko-KR')}</OldCodeDate>
            </OldCodeRow>
          ))}
        </OldCodeList>
      )}
    </Card>
  );
};

export default InviteCodeCard;

const QrBody = styled.div({
  padding: 18,
  display: 'flex',
  gap: 18,
  alignItems: 'flex-start',
});

const QrVisual = styled.div(({ theme }) => ({
  flex: 'none',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  padding: 12,
}));

const QrDetail = styled.div({
  flex: 1,
  minWidth: 0,
});

const QrTag = styled.span(({ theme }) => ({
  display: 'inline-block',
  padding: '4px 9px',
  borderRadius: theme.radius.label,
  backgroundColor: theme.semantic.stateOkBg,
  color: theme.semantic.stateOkFg,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
}));

const QrCodeText = styled.span(({ theme }) => ({
  display: 'block',
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.semibold,
  marginTop: 10,
}));

const QrMeta = styled.span(({ theme }) => ({
  display: 'block',
  fontSize: theme.fontSize.body,
  color: theme.semantic.textMuted,
  lineHeight: 1.65,
  marginTop: 6,
}));

const QrActions = styled.span({
  display: 'flex',
  gap: 9,
  marginTop: 14,
  flexWrap: 'wrap',
});

const ReissueButton = styled(SecondaryButton)(({ theme }: { theme: Theme }) => ({
  color: theme.color.alert,
}));

const EmptyQr = styled.div(({ theme }) => ({
  flex: 1,
  textAlign: 'center',
  padding: '24px 0',
  color: theme.semantic.textMuted,
  fontSize: theme.fontSize.body,
}));

const IssueButton = styled(PrimaryButton)({
  display: 'block',
  margin: '14px auto 0',
});

const Notice = styled.div(({ theme }) => ({
  margin: '0 18px 18px',
  padding: '13px 15px',
  backgroundColor: theme.color.grey50,
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  fontSize: theme.fontSize.body,
  lineHeight: 1.7,
  color: theme.semantic.textSecondary,
}));

const OldCodeList = styled.div({
  margin: '0 18px 18px',
});

const OldCodeTitle = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.bold,
  marginBottom: 8,
}));

const OldCodeRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '11px 14px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  marginBottom: 7,
}));

const OldCodeBadge = styled.span(({ theme }) => ({
  flex: 'none',
  padding: '3px 8px',
  borderRadius: theme.radius.label,
  backgroundColor: theme.color.grey150,
  color: theme.semantic.textMuted,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
}));

const OldCodeValue = styled.span(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
  textDecoration: 'line-through',
}));

const OldCodeDate = styled.span(({ theme }) => ({
  flex: 'none',
  fontSize: theme.fontSize.small,
  color: theme.semantic.textSecondary,
}));
