import type { CourseData, MessageData, RoomData, RoomListItem, RoomType } from '@common/shared';

const ROOM_TYPE_LABEL: Record<RoomType, string> = {
  notice: '공지방',
  chat: '이야기방',
  feed: '사진방',
};

export const roomTypeLabel = (type: RoomType) => ROOM_TYPE_LABEL[type];

const roomEntityName = (room: RoomData, courses: CourseData[], welfareName: string) => {
  if (!room.course) return welfareName;
  return courses.find(course => course._id === room.course)?.name ?? '삭제된 강좌';
};

export const roomTitle = (room: RoomData, courses: CourseData[], welfareName: string) =>
  `${roomEntityName(room, courses, welfareName)} ${roomTypeLabel(room.type)}`;

export const sortRoomEntries = (entries: RoomListItem[]) =>
  [...entries].sort((a, b) => {
    const aIsWelfareNotice = a.room.course === null;
    const bIsWelfareNotice = b.room.course === null;
    if (aIsWelfareNotice !== bIsWelfareNotice) return aIsWelfareNotice ? -1 : 1;

    const aTime = a.latestMessage?.createdAt ?? a.room.createdAt;
    const bTime = b.latestMessage?.createdAt ?? b.room.createdAt;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

export const previewText = (message: MessageData | null) => {
  if (!message || message.hidden) return '아직 온 소식이 없습니다';
  if (message.photos.length > 0 && !message.text) return '사진';
  return message.text;
};

export const formatTime = (isoDate: string) => {
  const date = new Date(isoDate);
  const now = new Date();
  const isToday = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();

  if (isToday) {
    const hours = date.getHours();
    const period = hours < 12 ? '오전' : '오후';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${period} ${displayHour}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const WEEKDAY_LABEL = ['일', '월', '화', '수', '목', '금', '토'];

export const dayKey = (isoDate: string) => isoDate.slice(0, 10);

export const messageDateLabel = (isoDate: string) => {
  const date = new Date(isoDate);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAY_LABEL[date.getDay()]}요일`;
};
