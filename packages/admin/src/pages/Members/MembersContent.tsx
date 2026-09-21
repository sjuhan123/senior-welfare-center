import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import type { MemberFilter, MembershipRole, WelfareMemberData } from '@common/shared';
import Card from '../../components/ui/Card';
import SecondaryButton from '../../components/ui/SecondaryButton';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import useGetWelfareMembers from '../../hooks/api/membership/useGetWelfareMembers';
import useUpdateMemberRole from '../../hooks/api/membership/useUpdateMemberRole';
import useSetMemberActive from '../../hooks/api/membership/useSetMemberActive';
import { getPatchErrorMessage } from '../../hooks/useOptimisticPatch';
import MemberFilterBar from './MemberFilterBar';
import MemberTable from './MemberTable';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;
const ROLE_ERROR_DISPLAY_MS = 2000;

const MembersContent = ({ welfareId }: { welfareId: string }) => {
  const [filter, setFilter] = useState<MemberFilter>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState<WelfareMemberData | null>(null);
  const [roleError, setRoleError] = useState<{ membershipId: string; message: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!roleError) return;
    const timer = setTimeout(() => setRoleError(null), ROLE_ERROR_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [roleError]);

  const params = { filter, search, sort, page, limit: PAGE_SIZE };
  const { data } = useGetWelfareMembers(welfareId, params);
  const { mutate: updateRole } = useUpdateMemberRole(welfareId, params);
  const { mutate: setActive, isPending, isSuccess, error: activeError, reset } = useSetMemberActive(welfareId, params);

  const members = data?.data.members ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleFilterChange = (next: MemberFilter) => {
    setFilter(next);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleSortChange = () => {
    setSort(prev => (prev === 'desc' ? 'asc' : 'desc'));
    setPage(1);
  };

  const handleRoleChange = (member: WelfareMemberData, role: MembershipRole) => {
    updateRole(
      { membershipId: member._id, role, updatedAt: member.updatedAt },
      { onError: err => setRoleError({ membershipId: member._id, message: getPatchErrorMessage(err) }) },
    );
  };

  const handleToggleActive = (member: WelfareMemberData) => {
    if (member.active) {
      setConfirmTarget(member);
      return;
    }

    setActive({ membershipId: member._id, active: true, updatedAt: member.updatedAt }, { onSuccess: () => reset() });
  };

  const handleConfirm = () => {
    if (!confirmTarget) return;
    setActive({ membershipId: confirmTarget._id, active: false, updatedAt: confirmTarget.updatedAt });
  };

  const handleDialogClose = () => {
    setConfirmTarget(null);
    reset();
  };

  return (
    <Card>
      <MemberFilterBar filter={filter} onFilterChange={handleFilterChange} search={searchInput} onSearchChange={handleSearchChange} />
      <MemberTable
        members={members}
        sort={sort}
        onSortChange={handleSortChange}
        onRoleChange={handleRoleChange}
        onToggleActive={handleToggleActive}
        roleError={roleError}
      />
      <Footer>
        <FooterText>전체 {total}명</FooterText>
        <SecondaryButton onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
          이전
        </SecondaryButton>
        <PageText>
          {page} / {totalPages}
        </PageText>
        <SecondaryButton onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
          다음
        </SecondaryButton>
      </Footer>

      <ConfirmDialog
        open={confirmTarget !== null}
        title={confirmTarget ? `${confirmTarget.userName} 님을 비활성으로 두시겠습니까?` : ''}
        successMessage="처리되었습니다"
        errorMessage={activeError ? getPatchErrorMessage(activeError) : null}
        isPending={isPending}
        isSuccess={isSuccess}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmTarget(null)}
        onClose={handleDialogClose}
      />
    </Card>
  );
};

export default MembersContent;

const Footer = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '12px 18px',
  borderTop: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.semantic.bgSunken,
}));

const FooterText = styled.span(({ theme }) => ({
  flex: 1,
  fontSize: theme.fontSize.small,
  color: theme.semantic.textMuted,
}));

const PageText = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
}));
