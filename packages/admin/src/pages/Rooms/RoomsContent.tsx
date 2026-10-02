import { useState } from 'react';
import styled from '@emotion/styled';
import useGetCourses from '../../hooks/api/course/useGetCourses';
import useGetCourseRooms from '../../hooks/api/room/useGetCourseRooms';
import RoomList from './RoomList';
import RoomDetail from './RoomDetail';

const RoomsContent = ({ welfareId }: { welfareId: string }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const { data: coursesData } = useGetCourses(welfareId);
  const openCourses = (coursesData?.data ?? []).filter(course => !course.endedAt);
  const selectedCourse = openCourses.find(course => course._id === selectedCourseId) ?? openCourses[0] ?? null;

  const { data: roomsData } = useGetCourseRooms(welfareId, selectedCourse?._id ?? null);
  const rooms = roomsData?.data ?? [];
  const selectedRoom = rooms.find(room => room._id === selectedRoomId) ?? rooms[0] ?? null;

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedRoomId(null);
  };

  return (
    <div>
      <TopRow>
        <Title>대화방 관리</Title>
      </TopRow>

      {openCourses.length === 0 ? (
        <Empty>운영 중인 강좌가 없습니다</Empty>
      ) : (
        <>
          <CourseSelectRow>
            <Label>강좌</Label>
            <Select value={selectedCourse?._id ?? ''} onChange={e => handleSelectCourse(e.target.value)}>
              {openCourses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </Select>
          </CourseSelectRow>

          <Grid>
            <RoomList rooms={rooms} selectedId={selectedRoom?._id ?? null} onSelect={room => setSelectedRoomId(room._id)} />
            {selectedRoom && selectedCourse && <RoomDetail welfareId={welfareId} courseId={selectedCourse._id} room={selectedRoom} />}
          </Grid>
        </>
      )}
    </div>
  );
};

export default RoomsContent;

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

const CourseSelectRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 14,
});

const Label = styled.span(({ theme }) => ({
  flex: 'none',
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
}));

const Select = styled.select(({ theme }) => ({
  flex: 'none',
  minWidth: 220,
  height: theme.hit.input,
  padding: '0 9px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.medium,
}));

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1.25fr',
  gap: 16,
  alignItems: 'start',
});

const Empty = styled.div(({ theme }) => ({
  padding: '40px 18px',
  textAlign: 'center' as const,
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.card,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textSecondary,
}));
