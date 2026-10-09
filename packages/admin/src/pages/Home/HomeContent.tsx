import styled from '@emotion/styled';
import type { RoomType } from '@common/shared';
import useGetWelfareMembers from '../../hooks/api/membership/useGetWelfareMembers';
import useGetCourses from '../../hooks/api/course/useGetCourses';
import useGetPendingEnrollmentCounts from '../../hooks/api/course/useGetPendingEnrollmentCounts';
import useGetRooms from '../../hooks/api/room/useGetRooms';
import useGetNotices from '../../hooks/api/notice/useGetNotices';
import useGetNoticeCount from '../../hooks/api/notice/useGetNoticeCount';
import useGetMeals from '../../hooks/api/meal/useGetMeals';
import useGetInviteCode from '../../hooks/api/welfare/useGetInviteCode';
import { toIso, weekOf } from '../../utils/date';
import HomeStats from './components/HomeStats';
import HomeTodoList, { type Todo } from './components/HomeTodoList';
import HomeTodaySidebar from './components/HomeTodaySidebar';

const ROOM_TYPE_LABEL: Record<RoomType, string> = { notice: '공지방', chat: '이야기방', feed: '사진방' };

const TODAY_ISO = toIso(new Date());
const TODAY_MONTH = TODAY_ISO.slice(0, 7);
const WEEK_START_ISO = weekOf(TODAY_ISO)[0];
const WEEK_SINCE = new Date(`${WEEK_START_ISO}T00:00:00`).toISOString();
const IS_WEEKEND = [0, 6].includes(new Date(`${TODAY_ISO}T00:00:00`).getDay());

const MEMBER_PARAMS = { search: '', sort: 'desc' as const, page: 1, limit: 1 };

const HomeContent = ({ welfareId }: { welfareId: string }) => {
  const { data: allMembersData } = useGetWelfareMembers(welfareId, { ...MEMBER_PARAMS, filter: 'all' });
  const totalMembers = allMembersData?.data.total ?? 0;

  const { data: pendingMembersData } = useGetWelfareMembers(welfareId, { ...MEMBER_PARAMS, filter: 'pending' });
  const pendingMembers = pendingMembersData?.data.total ?? 0;

  const { data: coursesData } = useGetCourses(welfareId);
  const openCourses = (coursesData?.data ?? []).filter(course => !course.endedAt);
  const courseNameById = new Map(openCourses.map(course => [course._id, course.name]));

  const { data: pendingEnrollmentsData } = useGetPendingEnrollmentCounts(welfareId);
  const pendingEnrollments = pendingEnrollmentsData?.data ?? [];
  const totalPendingEnrollments = pendingEnrollments.reduce((sum, entry) => sum + entry.count, 0);

  const { data: noticeCountData } = useGetNoticeCount(welfareId, WEEK_SINCE);
  const weekNoticeCount = noticeCountData?.data.count ?? 0;

  const { data: roomsData } = useGetRooms(welfareId);
  const roomsNeedingTime = (roomsData?.data ?? [])
    .map(entry => entry.room)
    .filter(room => (room.type === 'chat' || room.type === 'feed') && room.availableFrom === null)
    .filter(room => room.course && courseNameById.has(room.course));

  const { data: noticesData } = useGetNotices(welfareId);
  const latestNotice = noticesData?.pages[0]?.data[0] ?? null;

  const { data: mealsData } = useGetMeals(welfareId, TODAY_MONTH);
  const todayMeal = (mealsData?.data ?? []).find(meal => meal.date === TODAY_ISO) ?? null;

  const { data: inviteCodeData } = useGetInviteCode(welfareId);
  const activeInviteCode = inviteCodeData?.data.active ?? null;

  const stats = [
    { name: '전체 회원', value: `${totalMembers}명`, delta: pendingMembers > 0 ? `새 가입 ${pendingMembers}` : '' },
    { name: '운영 강좌', value: `${openCourses.length}개`, delta: '' },
    { name: '승인 대기 신청', value: `${totalPendingEnrollments}건`, delta: totalPendingEnrollments > 0 ? '확인 필요' : '없음' },
    { name: '이번 주 공지', value: `${weekNoticeCount}건`, delta: '' },
  ];

  const todos: Todo[] = [
    ...pendingEnrollments.map(entry => ({
      key: `enrollment-${entry.courseId}`,
      tag: '신청' as const,
      text: `${entry.courseName} 신청 ${entry.count}건이 기다리고 있습니다`,
      cta: '강좌로',
      to: '/courses',
    })),
    ...(pendingMembers > 0
      ? [{ key: 'members', tag: '회원' as const, text: `QR로 새로 가입한 회원 ${pendingMembers}명 확인`, cta: '회원으로', to: '/members' }]
      : []),
    ...(!IS_WEEKEND && !todayMeal
      ? [{ key: 'meal', tag: '식단' as const, text: '오늘의 밥을 아직 등록하지 않았습니다', cta: '달력 열기', to: '/meals' }]
      : []),
    ...roomsNeedingTime.map(room => ({
      key: `room-${room._id}`,
      tag: '대화방' as const,
      text: `${courseNameById.get(room.course as string)} ${ROOM_TYPE_LABEL[room.type]} 이용 시간이 아직 설정되지 않았습니다`,
      cta: '설정',
      to: '/rooms',
    })),
  ];

  return (
    <div>
      <TopRow>
        <Title>대시보드</Title>
      </TopRow>

      <HomeStats stats={stats} />

      <Grid>
        <HomeTodoList todos={todos} />
        <HomeTodaySidebar
          todayMealText={todayMeal ? todayMeal.items.join(', ') : '등록되지 않았습니다'}
          latestNoticeText={latestNotice ? latestNotice.text : '없습니다'}
          inviteCode={activeInviteCode}
        />
      </Grid>
    </div>
  );
};

export default HomeContent;

const TopRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 14,
});

const Title = styled.span(({ theme }) => ({
  flex: 1,
  fontSize: theme.fontSize.title,
  fontWeight: theme.font.weight.bold,
}));

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: '1.35fr 1fr',
  gap: 16,
  marginTop: 16,
  alignItems: 'start',
});
