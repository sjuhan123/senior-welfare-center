import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { RoomData, RoomType } from '@common/shared';

const ROOM_TYPE_LABEL: Record<RoomType, string> = { notice: '공지방', chat: '이야기방', feed: '사진방' };

type Props = {
  rooms: RoomData[];
  selectedId: string | null;
  onSelect: (room: RoomData) => void;
};

const RoomList = ({ rooms, selectedId, onSelect }: Props) => {
  return (
    <Card>
      <Header>
        <Title>대화방 {rooms.length}개</Title>
      </Header>

      <List>
        {rooms.length === 0 ? (
          <Empty>이 강좌에 연결된 대화방이 없습니다</Empty>
        ) : (
          rooms.map(room => {
            const ItemRow = room._id === selectedId ? ActiveRow : Row;
            return (
              <ItemRow key={room._id} onClick={() => onSelect(room)}>
                <RoomName>{ROOM_TYPE_LABEL[room.type]}</RoomName>
              </ItemRow>
            );
          })
        )}
      </List>
    </Card>
  );
};

export default RoomList;

const Card = styled.div(({ theme }) => ({
  backgroundColor: theme.color.grey0,
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.card,
}));

const Header = styled.div(({ theme }) => ({
  padding: '14px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

const Title = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.bold,
}));

const List = styled.div({});

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

const RoomName = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.label,
  fontWeight: theme.font.weight.bold,
}));

const Empty = styled.div(({ theme }) => ({
  padding: '30px 18px',
  textAlign: 'center' as const,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textSecondary,
}));
