import type { ScheduleItem, Weekday } from '@common/shared';

export const WEEKDAY_ORDER: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  sun: '일',
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  sat: '토',
};

export const formatTime = (time: string) => {
  if (!time) return '';

  const [hourStr, minute] = time.split(':');
  const hour = Number(hourStr);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${period} ${displayHour}:${minute}`;
};

export const formatSchedule = (schedule: ScheduleItem[]) => {
  if (!schedule.length) return '시간 미정';

  return [...schedule]
    .sort((a, b) => WEEKDAY_ORDER.indexOf(a.day) - WEEKDAY_ORDER.indexOf(b.day))
    .map(item => `${WEEKDAY_LABEL[item.day]} ${formatTime(item.startTime)}~${formatTime(item.endTime)}`)
    .join(' · ');
};

export const isScheduleValid = (schedule: ScheduleItem[]) => schedule.every(item => item.endTime > item.startTime);

export const formatDate = (iso: string) => iso.slice(0, 10);
