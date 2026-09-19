import { useNavigate } from 'react-router';

import { post } from '../libs/api';
import { END_POINT } from '../constant/endpoint';

const useLogout = () => {
  const navigate = useNavigate();

  return async () => {
    await post(END_POINT.ADMIN_LOGOUT);
    navigate('/login', { replace: true });
  };
};

export default useLogout;
