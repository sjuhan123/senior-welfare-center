import { useState } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { LostItemData } from '@common/shared';

type Filter = 'keeping' | 'claimed' | 'all';
const SHOW_STEP = 6;

type Props = {
  lostItems: LostItemData[];
  selectedId: string | null;
  onSelectItem: (item: LostItemData) => void;
  onToggleClaimed: (item: LostItemData) => void;
  onDelete: (item: LostItemData) => void;
};

const LostList = ({ lostItems, selectedId, onSelectItem, onToggleClaimed, onDelete }: Props) => {
  const [filter, setFilter] = useState<Filter>('keeping');
  const [shown, setShown] = useState(SHOW_STEP);

  const keepingCount = lostItems.filter(li => !li.claimed).length;
  const claimedCount = lostItems.length - keepingCount;

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'keeping', label: '보관 중', count: keepingCount },
    { id: 'claimed', label: '주인 찾음', count: claimedCount },
    { id: 'all', label: '전체', count: lostItems.length },
  ];

  const filtered = lostItems.filter(li => (filter === 'all' ? true : filter === 'claimed' ? li.claimed : !li.claimed));
  const visible = filtered.slice(0, shown);
  const hasMore = shown < filtered.length;
  const canFold = shown >= filtered.length && filtered.length > SHOW_STEP;

  const handleFilterChange = (next: Filter) => {
    setFilter(next);
    setShown(SHOW_STEP);
  };

  return (
    <Card>
      <Header>
        <Title>등록된 분실물</Title>
        <Summary>
          보관 중 {keepingCount}건 · 주인 찾음 {claimedCount}건
        </Summary>
      </Header>

      <FilterRow>
        {filters.map(f => {
          const Pill = f.id === filter ? ActivePill : InactivePill;
          return (
            <Pill key={f.id} onClick={() => handleFilterChange(f.id)}>
              {f.label} {f.count}
            </Pill>
          );
        })}
      </FilterRow>

      <ColumnHeader>
        <ItemHeaderCell>물건</ItemHeaderCell>
        <WhereHeaderCell>찾은 곳</WhereHeaderCell>
        <WhenHeaderCell>찾은 날</WhenHeaderCell>
        <StatusHeaderCell>상태</StatusHeaderCell>
        <ActionHeaderCell>관리</ActionHeaderCell>
      </ColumnHeader>

      {filtered.length === 0 ? (
        <Empty>이 상태에 해당하는 분실물이 없습니다.</Empty>
      ) : (
        visible.map(li => {
          const ItemName = li.claimed ? ItemNameMuted : ItemNameDefault;
          const ItemRow = li._id === selectedId ? ActiveRow : Row;

          return (
            <ItemRow key={li._id} onClick={() => onSelectItem(li)}>
              <ItemCell>
                <ItemName>{li.item}</ItemName>
                <ItemKeep>{li.claimed ? '주인에게 돌려드렸습니다' : li.keep || '보관 장소 미지정'}</ItemKeep>
              </ItemCell>
              <WhereCell>{li.where}</WhereCell>
              <WhenCell>{li.when ? `${li.when} 찾음` : ''}</WhenCell>
              <StatusCell>{li.claimed ? <ClaimedTag>주인 찾음</ClaimedTag> : <KeepingTag>보관 중</KeepingTag>}</StatusCell>
              <ActionCell onClick={e => e.stopPropagation()}>
                <ToggleButton onClick={() => onToggleClaimed(li)}>{li.claimed ? '보관 중으로' : '주인 찾음'}</ToggleButton>
                <DeleteButton onClick={() => onDelete(li)}>삭제</DeleteButton>
              </ActionCell>
            </ItemRow>
          );
        })
      )}

      {hasMore && (
        <MoreButton onClick={() => setShown(s => s + SHOW_STEP)}>
          분실물 {Math.min(SHOW_STEP, filtered.length - shown)}건 더 보기 (남은 {filtered.length - shown}건)
        </MoreButton>
      )}
      {canFold && <FoldButton onClick={() => setShown(SHOW_STEP)}>접기</FoldButton>}
    </Card>
  );
};

export default LostList;

const Card = styled.div(({ theme }) => ({
  backgroundColor: theme.color.grey0,
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.card,
}));

const Header = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '15px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

const Title = styled.span(({ theme }) => ({
  flex: 1,
  fontSize: theme.fontSize.title,
  fontWeight: theme.font.weight.bold,
}));

const Summary = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.body,
  color: theme.semantic.textMuted,
}));

const FilterRow = styled.div(({ theme }) => ({
  display: 'flex',
  gap: 10,
  padding: '11px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.semantic.bgSunken,
}));

const Pill = styled.button(({ theme }) => ({
  padding: '7px 13px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.sheet,
  backgroundColor: theme.color.grey0,
  color: theme.semantic.textSecondary,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  cursor: 'pointer',
}));

const ActivePill = styled(Pill)(({ theme }: { theme: Theme }) => ({
  borderColor: theme.color.navy,
  backgroundColor: theme.color.navy,
  color: theme.color.grey0,
}));

const InactivePill = Pill;

const ColumnHeader = styled.div(({ theme }) => ({
  display: 'flex',
  gap: 14,
  padding: '11px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
  color: theme.semantic.textSecondary,
}));

const ItemHeaderCell = styled.span({ flex: 1 });
const WhereHeaderCell = styled.span({ flex: 'none', width: 112 });
const WhenHeaderCell = styled.span({ flex: 'none', width: 96 });
const StatusHeaderCell = styled.span({ flex: 'none', width: 96 });
const ActionHeaderCell = styled.span({ flex: 'none', width: 158, textAlign: 'right' as const });

const Row = styled.div(({ theme }) => ({
  display: 'flex',
  gap: 14,
  alignItems: 'center',
  padding: '12px 18px',
  borderLeft: '3px solid transparent',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  cursor: 'pointer',
}));

const ActiveRow = styled(Row)(({ theme }: { theme: Theme }) => ({
  borderLeftColor: theme.color.navy,
  backgroundColor: theme.color.navyTint,
}));

const ItemCell = styled.span({ flex: 1, minWidth: 0 });

const ItemNameDefault = styled.span(({ theme }) => ({
  display: 'block',
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.semibold,
}));

const ItemNameMuted = styled(ItemNameDefault)(({ theme }: { theme: Theme }) => ({
  color: theme.semantic.textMuted,
}));

const ItemKeep = styled.span(({ theme }) => ({
  display: 'block',
  marginTop: 2,
  fontSize: theme.fontSize.small,
  color: theme.semantic.textMuted,
}));

const WhereCell = styled.span(({ theme }) => ({
  flex: 'none',
  width: 112,
  fontSize: theme.fontSize.body,
  color: theme.semantic.textSecondary,
}));

const WhenCell = styled.span(({ theme }) => ({
  flex: 'none',
  width: 96,
  fontSize: theme.fontSize.body,
  color: theme.semantic.textSecondary,
}));

const StatusCell = styled.span({ flex: 'none', width: 96 });

const Tag = styled.span(({ theme }) => ({
  display: 'inline-block',
  padding: '4px 9px',
  borderRadius: theme.radius.label,
  fontSize: theme.fontSize.caption,
  fontWeight: theme.font.weight.bold,
}));

const KeepingTag = styled(Tag)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.color.navySoft,
  color: theme.color.navyDeep,
}));

const ClaimedTag = styled(Tag)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.color.grey150,
  color: theme.semantic.textMuted,
}));

const ActionCell = styled.span({
  flex: 'none',
  width: 158,
  display: 'flex',
  gap: 7,
  justifyContent: 'flex-end',
});

const ToggleButton = styled.button(({ theme }) => ({
  padding: '7px 11px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  color: theme.color.navyDeep,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  cursor: 'pointer',
}));

const DeleteButton = styled.button(({ theme }) => ({
  padding: '7px 11px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  color: theme.color.alertText,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  cursor: 'pointer',
}));

const Empty = styled.div(({ theme }) => ({
  padding: '38px 18px',
  textAlign: 'center' as const,
  fontSize: theme.fontSize.bodyStrong,
  color: theme.semantic.textMuted,
}));

const MoreButton = styled.button(({ theme }) => ({
  display: 'block',
  width: '100%',
  padding: '13px 18px',
  border: 'none',
  borderTop: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.semantic.bgSunken,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.bold,
  color: theme.color.navy,
  cursor: 'pointer',
}));

const FoldButton = styled.button(({ theme }) => ({
  display: 'block',
  width: '100%',
  padding: '13px 18px',
  border: 'none',
  borderTop: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.semantic.bgSunken,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
  cursor: 'pointer',
}));
