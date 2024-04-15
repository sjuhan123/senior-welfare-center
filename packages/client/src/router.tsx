import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Auth from './pages/Auth';
import { ROUTE_PATH } from './constant/route';

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_PATH.WELFARE_LIST} element={<Main />} />
        <Route path={ROUTE_PATH.AUTH} element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
