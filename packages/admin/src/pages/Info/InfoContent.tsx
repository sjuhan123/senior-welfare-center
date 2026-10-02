import styled from '@emotion/styled';
import useGetWelfare from '../../hooks/api/welfare/useGetWelfare';
import useGetInviteCode from '../../hooks/api/welfare/useGetInviteCode';
import WelfareInfoCard from './WelfareInfoCard';
import InviteCodeCard from './InviteCodeCard';

const InfoContent = ({ welfareId }: { welfareId: string }) => {
  const { data: welfareRes } = useGetWelfare(welfareId);
  const { data: inviteCodeRes } = useGetInviteCode(welfareId);

  if (!welfareRes) return null;

  return (
    <Grid>
      <WelfareInfoCard welfareId={welfareId} welfare={welfareRes.data} />
      <InviteCodeCard welfareId={welfareId} active={inviteCodeRes?.data.active ?? null} history={inviteCodeRes?.data.history ?? []} />
    </Grid>
  );
};

export default InfoContent;

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1.15fr',
  gap: 16,
  alignItems: 'start',
});
