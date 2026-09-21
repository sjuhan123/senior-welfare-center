import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { MemberFilter } from '@common/shared';

const FILTERS: { id: MemberFilter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'staff', label: '관리자' },
  { id: 'teacher', label: '선생님' },
  { id: 'member', label: '회원' },
  { id: 'off', label: '비활성' },
];

type Props = {
  filter: MemberFilter;
  onFilterChange: (filter: MemberFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

const MemberFilterBar = ({ filter, onFilterChange, search, onSearchChange }: Props) => {
  return (
    <Bar>
      <Title>회원 목록</Title>
      <Divider />
      <Tabs>
        {FILTERS.map(f => {
          const Button = f.id === filter ? ActiveTabButton : TabButton;
          return (
            <Button key={f.id} onClick={() => onFilterChange(f.id)}>
              {f.label}
            </Button>
          );
        })}
      </Tabs>
      <Spacer />
      <SearchInput value={search} onChange={e => onSearchChange(e.target.value)} placeholder="이름으로 검색" />
    </Bar>
  );
};

export default MemberFilterBar;

const Bar = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '15px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

const Title = styled.span(({ theme }) => ({
  flex: 'none',
  fontSize: theme.fontSize.title,
  fontWeight: theme.font.weight.bold,
}));

const Divider = styled.span(({ theme }) => ({
  flex: 'none',
  width: 1,
  height: 16,
  backgroundColor: theme.semantic.border,
}));

const Tabs = styled.div({
  display: 'flex',
  gap: 6,
  flex: 'none',
});

const Spacer = styled.span({ flex: 1 });

const TabButton = styled.button(({ theme }) => ({
  padding: '7px 12px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  color: theme.semantic.textSecondary,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  cursor: 'pointer',
}));

const ActiveTabButton = styled(TabButton)(({ theme }: { theme: Theme }) => ({
  borderColor: theme.color.navy,
  backgroundColor: theme.color.navy,
  color: theme.color.grey0,
}));

const SearchInput = styled.input(({ theme }) => ({
  flex: 'none',
  width: 214,
  height: theme.hit.input,
  padding: '0 11px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.body,
}));
