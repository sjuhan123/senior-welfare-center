import { createBrowserRouter } from 'react-router';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Info from './pages/Info/Info';
import Notices from './pages/Notices/Notices';
import Members from './pages/Members/Members';
import Courses from './pages/Courses/Courses';
import Rooms from './pages/Rooms/Rooms';
import Meals from './pages/Meals/Meals';
import Lost from './pages/Lost/Lost';
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
        handle: { title: '대시보드', description: '오늘 처리할 일과 회원에게 보이는 내용' },
      },
      {
        path: 'info',
        Component: Info,
        handle: { title: '복지관 정보와 QR', description: '기본 정보 수정, 가입용 QR 발급과 인쇄' },
      },
      {
        path: 'notices',
        Component: Notices,
        handle: { title: '공지 관리', description: '공지방으로 보낸 글을 등록, 수정, 삭제합니다' },
      },
      {
        path: 'members',
        Component: Members,
        handle: { title: '회원 관리', description: '역할 배정, 회원 확인, 비활성 처리' },
      },
      {
        path: 'courses',
        Component: Courses,
        handle: { title: '강좌 관리', description: '강좌 등록과 수정, 신청 수락과 거절' },
      },
      {
        path: 'rooms',
        Component: Rooms,
        handle: { title: '대화방 관리', description: '강좌에 딸린 방의 참여 회원과 이용 시간' },
      },
      {
        path: 'meals',
        Component: Meals,
        handle: { title: '오늘의 밥', description: '달력에서 날짜를 눌러 식단을 등록합니다' },
      },
      {
        path: 'lost',
        Component: Lost,
        handle: { title: '분실물 관리', description: '찾은 물건을 등록하면 앱 복지관 탭 목록에 올라갑니다' },
      },
    ],
  },
]);

export default router;
