import useMyMembership from '../../hooks/useMyMembership';
import NoticesContent from './NoticesContent';

const Notices = () => {
  const { data: membership } = useMyMembership();

  if (!membership) return null;

  return <NoticesContent welfareId={membership.welfare._id} />;
};

export default Notices;
