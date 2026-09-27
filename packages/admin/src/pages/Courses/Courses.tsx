import useMyMembership from '../../hooks/useMyMembership';
import CoursesContent from './CoursesContent';

const Courses = () => {
  const { data: membership } = useMyMembership();

  if (!membership) return null;

  return <CoursesContent welfareId={membership.welfare._id} />;
};

export default Courses;
