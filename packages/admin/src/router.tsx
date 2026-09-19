import { createBrowserRouter } from 'react-router';
import Login from './pages/Login';
import Home from './pages/Home';
import { loader as loginLoader } from './routes/login/loader';
import { loader as layoutLoader } from './routes/layout/loader';
import Layout from './Layout';
import LoginPending from './routes/login/LoginPending';

const router = createBrowserRouter([
  {
    id: 'root',
    path: 'login',
    loader: loginLoader,
    Component: Login,
    HydrateFallback: LoginPending,
  },
  {
    path: '/',
    loader: layoutLoader,
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
]);

export default router;
