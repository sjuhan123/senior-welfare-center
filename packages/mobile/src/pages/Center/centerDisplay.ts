import type { CourseData, EnrollmentState, MembershipRole, Weekday } from '@common/shared';

export const ROLE_LABEL: Record<MembershipRole, string> = { member: '회원', teacher: '선생님', admin: '관리자', super: '관리자' };

// 강좌 신청 카드 상태. 'dropped'(관리자 탈퇴 처리·본인 취소로 빠져나간 뒤)는 'none'과 똑같이
// 다시 신청할 수 있는 상태라 하나로 합침(실제 신청 가능 여부를 결정하는 backend의
// createEnrollment 중복 체크 기준과 맞춤 — pending/accepted만 막고 나머지는 재신청 허용).
export type CourseCardState = 'none' | 'pending' | 'accepted' | 'rejected';

export const getCourseCardState = (state: EnrollmentState | undefined): CourseCardState => {
  if (state === 'pending' || state === 'accepted' || state === 'rejected') return state;
  return 'none';
};

export const toIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const WEEKDAY_ORDER: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const WEEKDAY_LABEL: Record<Weekday, string> = { sun: '일', mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토' };

const formatTime = (time: string) => {
  const [hourStr, minute] = time.split(':');
  const hour = Number(hourStr);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${period} ${displayHour}:${minute}`;
};

export const formatSchedule = (schedule: CourseData['schedule']) => {
  if (!schedule.length) return '시간 미정';
  return [...schedule]
    .sort((a, b) => WEEKDAY_ORDER.indexOf(a.day) - WEEKDAY_ORDER.indexOf(b.day))
    .map(item => `${WEEKDAY_LABEL[item.day]} ${formatTime(item.startTime)}~${formatTime(item.endTime)}`)
    .join(' · ');
};
