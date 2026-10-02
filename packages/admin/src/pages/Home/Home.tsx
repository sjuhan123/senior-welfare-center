import useMyMembership from '../../hooks/useMyMembership';
import HomeContent from './HomeContent';

const Home = () => {
  const { data: membership } = useMyMembership();

  if (!membership) return null;

  return <HomeContent welfareId={membership.welfare._id} />;
};

export default Home;
