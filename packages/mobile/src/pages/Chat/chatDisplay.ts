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

/** 항상 시각만 표시. 채팅방 안에서는 날짜 구분선이 이미 있어서 메시지마다 날짜를 또 보여줄 필요 없음 */
export const formatMessageTime = (isoDate: string) => {
  const date = new Date(isoDate);
  const hours = date.getHours();
  const period = hours < 12 ? '오전' : '오후';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${period} ${displayHour}:${String(date.getMinutes()).padStart(2, '0')}`;
};

/** 오늘이면 시각, 아니면 날짜. 대화 목록의 미리보기 시각용 */
export const formatPreviewTime = (isoDate: string) => {
  const date = new Date(isoDate);
  const now = new Date();
  const isToday = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();

  if (isToday) return formatMessageTime(isoDate);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const WEEKDAY_LABEL = ['일', '월', '화', '수', '목', '금', '토'];

/** 로컬 기준 날짜 키. UTC로 자르면 자정~오전 9시(KST) 사이 메시지가 하루 전 날짜로 묶여버림 */
export const dayKey = (isoDate: string) => {
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export const messageDateLabel = (isoDate: string) => {
  const date = new Date(isoDate);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAY_LABEL[date.getDay()]}요일`;
};
