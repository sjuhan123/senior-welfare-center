import useMyMembership from '../../hooks/useMyMembership';
import RoomsContent from './RoomsContent';

const Rooms = () => {
  const { data: membership } = useMyMembership();

  if (!membership) return null;

  return <RoomsContent welfareId={membership.welfare._id} />;
};

export default Rooms;
