import { useState } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { EnrollmentState } from '@common/shared';
import useGetEnrollments from '../../../hooks/api/course/useGetEnrollments';
import useUpdateEnrollment from '../../../hooks/api/course/useUpdateEnrollment';
import useBulkUpdateEnrollments from '../../../hooks/api/course/useBulkUpdateEnrollments';

const STATE_LABEL: Record<EnrollmentState, string> = {
  pending: '신청함',
  accepted: '수강 중',
  rejected: '거절됨',
  dropped: '탈퇴됨',
};

const isPickable = (state: EnrollmentState) => state === 'pending' || state === 'accepted';

type Props = { welfareId: string; courseId: string };

const EnrollmentList = ({ welfareId, courseId }: Props) => {
  const [picked, setPicked] = useState<string[]>([]);

  const { data } = useGetEnrollments(welfareId, courseId);
  const enrollments = data?.data ?? [];

  const { mutate: updateOne } = useUpdateEnrollment(welfareId);
  const { mutate: updateBulk } = useBulkUpdateEnrollments(welfareId);

  const pickable = enrollments.filter(e => isPickable(e.state));
  const allPicked = pickable.length > 0 && pickable.every(e => picked.includes(e._id));

  const togglePick = (id: string) => {
    setPicked(prev => (prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setPicked(allPicked ? [] : pickable.map(e => e._id));
  };

  const handleBulk = (state: EnrollmentState) => {
    if (!picked.length) return;
    updateBulk({ courseId, enrollmentIds: picked, state });
    setPicked([]);
  };

  return (
    <div>
      {picked.length > 0 && (
        <BulkBar>
          <BulkText>{picked.length}명 선택됨</BulkText>
          <PrimaryChip onClick={() => handleBulk('accepted')}>선택 수락</PrimaryChip>
          <DangerChip onClick={() => handleBulk('dropped')}>선택 탈퇴 처리</DangerChip>
          <PlainChip onClick={() => setPicked([])}>선택 해제</PlainChip>
        </BulkBar>
      )}

      <ColumnHeader>
        {pickable.length > 0 && <HeaderCheckbox checked={allPicked} onClick={toggleAll} />}
        <span style={{ flex: 1 }}>신청한 회원</span>
        <span style={{ flex: 'none', width: 96 }}>신청일</span>
        <span style={{ flex: 'none', width: 160, textAlign: 'right' }}>관리</span>
      </ColumnHeader>

      {enrollments.length === 0 ? (
        <Empty>신청한 회원이 없습니다</Empty>
      ) : (
        enrollments.map(enrollment => (
          <Row key={enrollment._id}>
            {isPickable(enrollment.state) ? (
              <RowCheckbox checked={picked.includes(enrollment._id)} onClick={() => togglePick(enrollment._id)} />
            ) : (
              <span style={{ flex: 'none', width: 19 }} />
            )}
            <NameCell>
              <Name>{enrollment.userName}</Name>
              <StateText>{STATE_LABEL[enrollment.state]}</StateText>
            </NameCell>
            <DateCell>{new Date(enrollment.createdAt).toLocaleDateString('ko-KR')}</DateCell>
            <ActionCell>
              {enrollment.state === 'pending' && (
                <>
                  <AcceptButton onClick={() => updateOne({ courseId, enrollmentId: enrollment._id, state: 'accepted' })}>수락</AcceptButton>
                  <RejectButton onClick={() => updateOne({ courseId, enrollmentId: enrollment._id, state: 'rejected' })}>거절</RejectButton>
                </>
              )}
              {enrollment.state === 'accepted' && (
                <RejectButton onClick={() => updateOne({ courseId, enrollmentId: enrollment._id, state: 'dropped' })}>탈퇴 처리</RejectButton>
              )}
            </ActionCell>
          </Row>
        ))
      )}
    </div>
  );
};

export default EnrollmentList;

const Checkbox = styled.button<{ checked: boolean }>(({ theme, checked }) => ({
  flex: 'none',
  width: 19,
  height: 19,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `2px solid ${checked ? theme.color.navy : theme.semantic.border}`,
  borderRadius: theme.radius.label,
  backgroundColor: checked ? theme.color.navy : theme.color.grey0,
  color: theme.color.grey0,
  fontSize: theme.fontSize.caption,
  cursor: 'pointer',
  '&::after': { content: checked ? '"✓"' : '""' },
}));

const HeaderCheckbox = Checkbox;
const RowCheckbox = Checkbox;

const BulkBar = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 11,
  padding: '11px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.color.navyTint,
}));

const BulkText = styled.span(({ theme }) => ({
  flex: 1,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.bold,
  color: theme.color.navyDeep,
}));

const Chip = styled.button(({ theme }) => ({
  padding: '8px 13px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  cursor: 'pointer',
}));

const PrimaryChip = styled(Chip)(({ theme }: { theme: Theme }) => ({
  border: 'none',
  backgroundColor: theme.color.navy,
  color: theme.color.grey0,
  fontWeight: theme.font.weight.bold,
}));

const DangerChip = styled(Chip)(({ theme }: { theme: Theme }) => ({
  color: theme.color.alertText,
}));

const PlainChip = Chip;

const ColumnHeader = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
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

const StateText = styled.span(({ theme }) => ({
  display: 'block',
  marginTop: 3,
  fontSize: theme.fontSize.small,
  color: theme.semantic.textMuted,
}));

const DateCell = styled.span(({ theme }) => ({
  flex: 'none',
  width: 96,
  fontSize: theme.fontSize.small,
  color: theme.semantic.textMuted,
}));

const ActionCell = styled.div({
  flex: 'none',
  width: 160,
  display: 'flex',
  gap: 7,
  justifyContent: 'flex-end',
});

const AcceptButton = styled.button(({ theme }) => ({
  padding: '7px 12px',
  border: 'none',
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.navy,
  color: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.bold,
  cursor: 'pointer',
}));

const RejectButton = styled.button(({ theme }) => ({
  padding: '7px 12px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  color: theme.color.alertText,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  cursor: 'pointer',
}));

const Empty = styled.div(({ theme }) => ({
  padding: '30px 18px',
  textAlign: 'center' as const,
  fontSize: theme.fontSize.body,
  color: theme.semantic.textMuted,
}));
