import styled from '@emotion/styled';
import type { RoomData } from '@common/shared';
import useGetRoomMembers from '../../../hooks/api/room/useGetRoomMembers';
import useLeaveRoomMember from '../../../hooks/api/room/useLeaveRoomMember';
import useRejoinRoomMember from '../../../hooks/api/room/useRejoinRoomMember';

type Props = { welfareId: string; room: RoomData };

const RoomMemberList = ({ welfareId, room }: Props) => {
  const { data } = useGetRoomMembers(welfareId, room._id);
  const teacher = data?.data.teacher ?? null;
  const active = data?.data.active ?? [];
  const left = data?.data.left ?? [];

  const { mutate: leaveMember } = useLeaveRoomMember(welfareId, room._id);
  const { mutate: rejoinMember } = useRejoinRoomMember(welfareId, room._id);

  const memberCount = active.length + (teacher ? 1 : 0);

  return (
    <div>
      <Header>참여 회원 {memberCount}명</Header>

      {teacher && (
        <Row>
          <NameCell>
            <Name>{teacher.userName}</Name>
            <RoleText>선생님</RoleText>
          </NameCell>
        </Row>
      )}

      {active.length === 0 && !teacher ? (
        <Empty>참여 중인 회원이 없습니다</Empty>
      ) : (
        active.map(member => (
          <Row key={member.enrollmentId}>
            <NameCell>
              <Name>{member.userName}</Name>
              <RoleText>회원</RoleText>
            </NameCell>
            <ActionCell>
              <LeaveButton onClick={() => leaveMember(member.userId)}>내보내기</LeaveButton>
            </ActionCell>
          </Row>
        ))
      )}

      {left.length > 0 && (
        <>
          <Header>나간 회원 {left.length}명</Header>
          {left.map(member => (
            <Row key={member.enrollmentId}>
              <NameCell>
                <Name>{member.userName}</Name>
              </NameCell>
              <ActionCell>
                <RejoinButton onClick={() => rejoinMember(member.userId)}>재초대</RejoinButton>
              </ActionCell>
            </Row>
          ))}
        </>
      )}
    </div>
  );
};

export default RoomMemberList;

const Header = styled.div(({ theme }) => ({
  padding: '11px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.semantic.bgSunken,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
  color: theme.semantic.textSecondary,
}));

const Row = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '12px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

const NameCell = styled.div({ flex: 1, minWidth: 0 });

const Name = styled.span(({ theme }) => ({
  display: 'block',
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.semibold,
}));

const RoleText = styled.span(({ theme }) => ({
  display: 'block',
  marginTop: 3,
  fontSize: theme.fontSize.small,
  color: theme.semantic.textMuted,
}));

const ActionCell = styled.div({
  flex: 'none',
});

const LeaveButton = styled.button(({ theme }) => ({
  padding: '7px 12px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  color: theme.color.alertText,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  cursor: 'pointer',
}));

const RejoinButton = styled.button(({ theme }) => ({
  padding: '7px 12px',
  border: 'none',
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.navy,
  color: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.bold,
  cursor: 'pointer',
}));

const Empty = styled.div(({ theme }) => ({
  padding: '30px 18px',
  textAlign: 'center' as const,
  fontSize: theme.fontSize.body,
  color: theme.semantic.textMuted,
}));
