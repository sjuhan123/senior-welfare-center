import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { MembershipRole, WelfareMemberData } from '@common/shared';

const ROLE_OPTIONS: { value: MembershipRole; label: string }[] = [
  { value: 'member', label: '회원' },
  { value: 'teacher', label: '선생님' },
  { value: 'admin', label: '관리자' },
  { value: 'super', label: '슈퍼관리자' },
];

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ko-KR');

type Props = {
  members: WelfareMemberData[];
  sort: 'asc' | 'desc';
  onSortChange: () => void;
  onRoleChange: (membershipId: string, role: MembershipRole) => void;
  onToggleActive: (member: WelfareMemberData) => void;
};

const MemberTable = ({ members, sort, onSortChange, onRoleChange, onToggleActive }: Props) => {
  return (
    <div>
      <HeaderRow>
        <NameHeaderCell>이름</NameHeaderCell>
        <RoleHeaderCell>역할</RoleHeaderCell>
        <Spacer />
        <JoinedHeaderCell onClick={onSortChange}>가입일 {sort === 'desc' ? '↓' : '↑'}</JoinedHeaderCell>
        <StatusHeaderCell>상태</StatusHeaderCell>
        <ActionHeaderCell>관리</ActionHeaderCell>
      </HeaderRow>

      {members.length === 0 ? (
        <EmptyRow>이 조건에 맞는 회원이 없습니다</EmptyRow>
      ) : (
        members.map(member => (
          <Row key={member._id}>
            <NameCell>{member.userName}</NameCell>
            <RoleCell>
              <RoleSelect value={member.role} onChange={e => onRoleChange(member._id, e.target.value as MembershipRole)}>
                {ROLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </RoleSelect>
            </RoleCell>
            <Spacer />
            <JoinedCell>{formatDate(member.createdAt)}</JoinedCell>
            <StatusCell>{member.active ? <ActiveTag>활성</ActiveTag> : <InactiveTag>비활성</InactiveTag>}</StatusCell>
            <ActionCell>
              <ToggleButton onClick={() => onToggleActive(member)}>{member.active ? '비활성' : '활성으로'}</ToggleButton>
            </ActionCell>
          </Row>
        ))
      )}
    </div>
  );
};

export default MemberTable;

const HeaderRow = styled.div(({ theme }) => ({
  display: 'flex',
  gap: 14,
  padding: '11px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.semantic.bgSunken,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
  color: theme.semantic.textSecondary,
}));

const Row = styled.div(({ theme }) => ({
  display: 'flex',
  gap: 14,
  alignItems: 'center',
  padding: '12px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

const NameHeaderCell = styled.span({ flex: 'none', width: 140 });
const RoleHeaderCell = styled.span({ flex: 'none', width: 150 });
const Spacer = styled.span({ flex: 1, minWidth: 0 });
const JoinedHeaderCell = styled.span({ flex: 'none', width: 100, cursor: 'pointer' });
const StatusHeaderCell = styled.span({ flex: 'none', width: 80 });
const ActionHeaderCell = styled.span({ flex: 'none', width: 92, textAlign: 'right' as const });

const NameCell = styled.span(({ theme }) => ({
  flex: 'none',
  width: 140,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.semibold,
}));

const RoleCell = styled.span({ flex: 'none', width: 150 });

const RoleSelect = styled.select(({ theme }) => ({
  width: '100%',
  height: theme.hit.input,
  padding: '0 7px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
}));

const JoinedCell = styled.span(({ theme }) => ({
  flex: 'none',
  width: 100,
  fontSize: theme.fontSize.small,
  color: theme.semantic.textMuted,
}));

const StatusCell = styled.span({ flex: 'none', width: 80 });

const Tag = styled.span(({ theme }) => ({
  display: 'inline-block',
  padding: '3px 8px',
  borderRadius: theme.radius.label,
  fontSize: theme.fontSize.caption,
  fontWeight: theme.font.weight.bold,
}));

const ActiveTag = styled(Tag)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.semantic.stateOkBg,
  color: theme.semantic.stateOkFg,
}));

const InactiveTag = styled(Tag)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.semantic.stateStopBg,
  color: theme.semantic.stateStopFg,
}));

const ActionCell = styled.span({ flex: 'none', width: 92, display: 'flex', justifyContent: 'flex-end' });

const ToggleButton = styled.button(({ theme }) => ({
  padding: '7px 11px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  cursor: 'pointer',
}));

const EmptyRow = styled.div(({ theme }) => ({
  padding: '44px 18px',
  textAlign: 'center' as const,
  fontSize: theme.fontSize.bodyStrong,
  color: theme.semantic.textMuted,
}));
