import useMyMembership from '../../hooks/useMyMembership';
import InfoContent from './InfoContent';

const Info = () => {
  const { data: membership } = useMyMembership();

  if (!membership) return null;

  return <InfoContent welfareId={membership.welfare._id} />;
};

export default Info;
