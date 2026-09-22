import useMyMembership from '../../hooks/useMyMembership';
import LostContent from './LostContent';

const Lost = () => {
  const { data: membership } = useMyMembership();

  if (!membership) return null;

  return <LostContent welfareId={membership.welfare._id} />;
};

export default Lost;
