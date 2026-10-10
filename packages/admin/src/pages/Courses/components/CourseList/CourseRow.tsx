import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { CourseData } from '@common/shared';
import type { TeacherStatus } from '../../../../hooks/useTeacherOptions';
import useGetEnrollments from '../../../../hooks/api/course/useGetEnrollments';
import { formatSchedule, formatDate } from '../../courseDisplay';

const courseStatus = (to: string) => {
  const daysLeft = Math.round((new Date(to).getTime() - Date.now()) / 86400000);
  if (daysLeft <= 30) return { label: `종료 ${daysLeft}일 전`, warn: true };
  return { label: '운영 중', warn: false };
};

type CourseRowProps = {
  welfareId: string;
  course: CourseData;
  active: boolean;
  teacherInfo: { name: string; status: TeacherStatus } | null;
  needsReassignment: boolean;
  onSelect: () => void;
};

const CourseRow = ({ welfareId, course, active, teacherInfo, needsReassignment, onSelect }: CourseRowProps) => {
  const status = courseStatus(course.to);
  const { data } = useGetEnrollments(welfareId, course._id);
  const pendingCount = data?.data.filter(enrollment => enrollment.state === 'pending').length ?? 0;
  const acceptedCount = data?.data.filter(enrollment => enrollment.state === 'accepted').length ?? 0;
  const ItemRow = active ? ActiveRow : Row;

  return (
    <ItemRow onClick={onSelect}>
      <RowHead>
        <CourseName>{course.name}</CourseName>
        {pendingCount > 0 && <WaitingBadge>{pendingCount}</WaitingBadge>}
        <StatusTag warn={status.warn}>{status.label}</StatusTag>
      </RowHead>
      <SubText>
        {formatSchedule(course.schedule)} · {course.place || '장소 미정'}
      </SubText>
      <SubText>
        {teacherInfo ? teacherInfo.name : '선생님 미정'} · 정원 {course.cap}명 중 {acceptedCount}명
      </SubText>
      <SubText>
        {formatDate(course.from)} ~ {formatDate(course.to)}
      </SubText>
      {needsReassignment && teacherInfo && <WarnTag>담당 선생님 비활성 · 다시 배정하세요</WarnTag>}
    </ItemRow>
  );
};

export default CourseRow;

const Row = styled.button(({ theme }) => ({
  display: 'block',
  width: '100%',
  textAlign: 'left' as const,
  padding: '14px 18px',
  border: 'none',
  borderLeft: '3px solid transparent',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  backgroundColor: 'transparent',
  cursor: 'pointer',
}));

const ActiveRow = styled(Row)(({ theme }: { theme: Theme }) => ({
  borderLeftColor: theme.color.navy,
  backgroundColor: theme.color.navyTint,
}));

const RowHead = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

const CourseName = styled.span(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  fontSize: theme.fontSize.label,
  fontWeight: theme.font.weight.bold,
}));

const WaitingBadge = styled.span(({ theme }) => ({
  flex: 'none',
  minWidth: 22,
  height: 22,
  padding: '0 7px',
  borderRadius: 999,
  backgroundColor: theme.color.brownMark,
  color: theme.color.grey0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: theme.fontSize.caption,
  fontWeight: theme.font.weight.bold,
}));

const StatusTag = styled.span<{ warn: boolean }>(({ theme, warn }) => ({
  flex: 'none',
  padding: '2px 7px',
  borderRadius: theme.radius.label,
  backgroundColor: warn ? theme.semantic.stateWaitBg : theme.color.navySoft,
  color: warn ? theme.semantic.stateWaitFg : theme.color.navyDeep,
  fontSize: theme.fontSize.caption,
  fontWeight: theme.font.weight.bold,
}));

const SubText = styled.span(({ theme }) => ({
  display: 'block',
  marginTop: 4,
  fontSize: theme.fontSize.small,
  color: theme.semantic.textMuted,
}));

const WarnTag = styled.span(({ theme }) => ({
  display: 'inline-block',
  marginTop: 6,
  padding: '3px 8px',
  borderRadius: theme.radius.label,
  backgroundColor: theme.color.alertTint,
  color: theme.color.alertText,
  fontSize: theme.fontSize.caption,
  fontWeight: theme.font.weight.bold,
}));
