import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import type { MemberFilter, MembershipRole, WelfareMemberData } from '@common/shared';
import Card from '../../components/ui/Card';
import CardHeader from '../../components/ui/CardHeader';
import SecondaryButton from '../../components/ui/SecondaryButton';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import useGetWelfareMembers from '../../hooks/api/membership/useGetWelfareMembers';
import useUpdateMemberRole from '../../hooks/api/membership/useUpdateMemberRole';
import useSetMemberActive from '../../hooks/api/membership/useSetMemberActive';
import MemberFilterBar from './MemberFilterBar';
import MemberTable from './MemberTable';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

const MembersContent = ({ welfareId }: { welfareId: string }) => {
  const [filter, setFilter] = useState<MemberFilter>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState<WelfareMemberData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data } = useGetWelfareMembers(welfareId, { filter, search, sort, page, limit: PAGE_SIZE });
  const { mutate: updateRole } = useUpdateMemberRole(welfareId);
  const { mutate: setActive, isPending, isSuccess, reset } = useSetMemberActive(welfareId);

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

  const handleRoleChange = (membershipId: string, role: MembershipRole) => {
    updateRole({ membershipId, role });
  };

  const handleToggleActive = (member: WelfareMemberData) => {
    if (member.active) {
      setConfirmTarget(member);
      return;
    }

    setActive({ membershipId: member._id, active: true }, { onSuccess: () => reset() });
  };

  const handleConfirm = () => {
    if (!confirmTarget) return;
    setActive({ membershipId: confirmTarget._id, active: false });
  };

  const handleDialogClose = () => {
    setConfirmTarget(null);
    reset();
  };

  return (
    <Card>
      <CardHeader>회원</CardHeader>
      <MemberFilterBar filter={filter} onFilterChange={handleFilterChange} search={searchInput} onSearchChange={handleSearchChange} />
      <MemberTable
        members={members}
        sort={sort}
        onSortChange={handleSortChange}
        onRoleChange={handleRoleChange}
        onToggleActive={handleToggleActive}
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
