import useMyMembership from '../../hooks/useMyMembership';
import MembersContent from './MembersContent';

const Members = () => {
  const { data: membership } = useMyMembership();

  if (!membership) return null;

  return <MembersContent welfareId={membership.welfare._id} />;
};

export default Members;
