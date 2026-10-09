import { Link } from 'react-router';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { CourseData, RoomType } from '@common/shared';
import Card from '../../../components/ui/Card';
import CardHeader from '../../../components/ui/CardHeader';
import SecondaryButton from '../../../components/ui/SecondaryButton';
import type { TeacherOption, TeacherStatus } from '../../../hooks/useTeacherOptions';
import useGetRooms from '../../../hooks/api/room/useGetRooms';
import useGetEnrollments from '../../../hooks/api/course/useGetEnrollments';
import CourseEditForm from './CourseEditForm';
import EnrollmentList from './EnrollmentList';
import type { CourseFieldValues } from './CourseFields';
import { formatDate } from '../courseDisplay';

const ROOM_TYPE_LABEL: Record<RoomType, string> = { notice: '공지방', chat: '이야기방', feed: '사진방' };

type Props = {
  welfareId: string;
  course: CourseData;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: (values: CourseFieldValues) => void;
  onCancelEdit: () => void;
  isSaving: boolean;
  errorMessage: string | null;
  onDelete: () => void;
  teacherOptions: TeacherOption[];
  getTeacherInfo: (teacherId: string | null) => { name: string; status: TeacherStatus } | null;
  needsTeacherReassignment: (teacherId: string | null) => boolean;
};

const CourseDetail = ({
  welfareId,
  course,
  isEditing,
  onEditToggle,
  onSave,
  onCancelEdit,
  isSaving,
  errorMessage,
  onDelete,
  teacherOptions,
  getTeacherInfo,
  needsTeacherReassignment,
}: Props) => {
  const teacherInfo = getTeacherInfo(course.teacher);
  const teacherWarnText =
    teacherInfo === null
      ? '아직 선생님이 배정되지 않았습니다.'
      : teacherInfo.status === 'unknown'
        ? '등록되지 않은 선생님입니다.'
        : '비활성 상태입니다.';

  const { data: roomsData } = useGetRooms(welfareId);
  const courseRooms = (roomsData?.data ?? []).filter(entry => entry.room.course === course._id);

  const { data: enrollmentsData } = useGetEnrollments(welfareId, course._id);
  const memberCount = enrollmentsData?.data.filter(enrollment => enrollment.state === 'accepted').length ?? 0;

  return (
    <Card>
      <CardHeader>
        <HeaderRow>
          <Name>{course.name}</Name>
          <SecondaryButton onClick={onEditToggle}>{isEditing ? '수정 닫기' : '정보 수정'}</SecondaryButton>
          <DeleteButton onClick={onDelete}>강좌 삭제</DeleteButton>
        </HeaderRow>
      </CardHeader>

      {isEditing && (
        <CourseEditForm
          course={course}
          teacherOptions={teacherOptions}
          onSave={onSave}
          onCancel={onCancelEdit}
          isSaving={isSaving}
          errorMessage={errorMessage}
        />
      )}

      {needsTeacherReassignment(course.teacher) && (
        <WarnBanner>
          <WarnText>
            <b>담당 선생님을 배정해야 합니다.</b> {teacherWarnText} 정보 수정에서 선생님을 배정해 주세요.
          </WarnText>
          <SecondaryButton onClick={onEditToggle}>선생님 배정</SecondaryButton>
        </WarnBanner>
      )}

      <InfoRow>
        <InfoBlock>
          <InfoLabel>운영 기간</InfoLabel>
          <InfoValue>
            {formatDate(course.from)} ~ {formatDate(course.to)}
          </InfoValue>
        </InfoBlock>
        <InfoBlock>
          <InfoLabel>정원</InfoLabel>
          <InfoValue>
            {course.cap}명 중 {memberCount}명
          </InfoValue>
        </InfoBlock>
        <RoomChipsBlock>
          <InfoLabel>연결된 대화방</InfoLabel>
          <RoomChips>
            {courseRooms.length === 0 ? (
              <NoRoomText>연결된 대화방 없음</NoRoomText>
            ) : (
              courseRooms.map(entry => (
                <RoomChip key={entry.room._id} notice={entry.room.type === 'notice'}>
                  {ROOM_TYPE_LABEL[entry.room.type]} · {memberCount}명
                </RoomChip>
              ))
            )}
          </RoomChips>
        </RoomChipsBlock>
        <RoomLink to="/rooms">대화방 관리로</RoomLink>
      </InfoRow>

      <EnrollmentList welfareId={welfareId} courseId={course._id} />
    </Card>
  );
};

export default CourseDetail;

const HeaderRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

const Name = styled.span({
  flex: 1,
  minWidth: 0,
});

const DeleteButton = styled(SecondaryButton)(({ theme }: { theme: Theme }) => ({
  color: theme.color.alertText,
}));

const WarnBanner = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '13px 18px',
  borderBottom: `1px solid ${theme.color.alertLine}`,
  backgroundColor: theme.color.alertTint,
}));

const WarnText = styled.span(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  fontSize: theme.fontSize.body,
  lineHeight: 1.65,
  color: theme.color.alertText,
}));

const InfoRow = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 22,
  padding: '13px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.semantic.bgSunken,
}));

const InfoBlock = styled.div({ flex: 'none' });

const RoomChipsBlock = styled.div({ flex: 1, minWidth: 0 });

const RoomChips = styled.div({
  display: 'flex',
  gap: 7,
  marginTop: 5,
  flexWrap: 'wrap' as const,
});

const RoomChip = styled.span<{ notice: boolean }>(({ theme, notice }) => ({
  padding: '4px 9px',
  borderRadius: theme.radius.label,
  backgroundColor: notice ? theme.color.navySoft : theme.color.grey150,
  color: notice ? theme.color.navyDeep : theme.semantic.textSecondary,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
}));

const NoRoomText = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
}));

const InfoLabel = styled.span(({ theme }) => ({
  display: 'block',
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
}));

const InfoValue = styled.span(({ theme }) => ({
  display: 'block',
  marginTop: 4,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.bold,
}));

const RoomLink = styled(Link)(({ theme }: { theme: Theme }) => ({
  flex: 'none',
  alignSelf: 'center',
  padding: '7px 11px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textPrimary,
  textDecoration: 'none',
}));
