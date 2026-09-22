import useMyMembership from '../../hooks/useMyMembership';
import MealsContent from './MealsContent';

const Meals = () => {
  const { data: membership } = useMyMembership();

  if (!membership) return null;

  return <MealsContent welfareId={membership.welfare._id} />;
};

export default Meals;
