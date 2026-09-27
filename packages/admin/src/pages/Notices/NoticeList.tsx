import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { NoticeEntry } from '@common/shared';
import Card from '../../components/ui/Card';
import CardHeader from '../../components/ui/CardHeader';

type Props = {
  notices: NoticeEntry[];
  onEdit: (notice: NoticeEntry) => void;
  onDelete: (notice: NoticeEntry) => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
};

const NoticeList = ({ notices, onEdit, onDelete, hasMore, isLoadingMore, onLoadMore }: Props) => {
  return (
    <Card>
      <CardHeader>
        <HeaderRow>
          <span style={{ flex: 1 }}>보낸 공지</span>
          <Count>{notices.length}건</Count>
        </HeaderRow>
      </CardHeader>

      <ColumnHeader>
        <span style={{ flex: 'none', width: 150 }}>받는 곳</span>
        <span style={{ flex: 1 }}>내용</span>
        <span style={{ flex: 'none', width: 112 }}>보낸 때</span>
        <span style={{ flex: 'none', width: 150, textAlign: 'right' }}>관리</span>
      </ColumnHeader>

      {notices.length === 0 ? (
        <Empty>보낸 공지가 없습니다</Empty>
      ) : (
        notices.map(notice => (
          <Row key={notice._id}>
            <TargetCell>{notice.roomLabel}</TargetCell>
            <TextCell>{notice.text}</TextCell>
            <DateCell>{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</DateCell>
            <ActionCell>
              <EditButton onClick={() => onEdit(notice)}>수정</EditButton>
              <DeleteButton onClick={() => onDelete(notice)}>삭제</DeleteButton>
            </ActionCell>
          </Row>
        ))
      )}

      {hasMore && (
        <MoreButton onClick={onLoadMore} disabled={isLoadingMore}>
          {isLoadingMore ? '불러오는 중...' : '이전 공지 더 보기'}
        </MoreButton>
      )}
    </Card>
  );
};

export default NoticeList;

const HeaderRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

const Count = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.medium,
  color: theme.semantic.textMuted,
}));

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
  padding: '13px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

const TargetCell = styled.span(({ theme }) => ({
  flex: 'none',
  width: 150,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.color.navyDeep,
}));

const TextCell = styled.span(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.medium,
  lineHeight: 1.5,
}));

const DateCell = styled.span(({ theme }) => ({
  flex: 'none',
  width: 112,
  fontSize: theme.fontSize.small,
  color: theme.semantic.textMuted,
}));

const ActionCell = styled.div({
  flex: 'none',
  width: 150,
  display: 'flex',
  gap: 7,
  justifyContent: 'flex-end',
});

const EditButton = styled.button(({ theme }) => ({
  padding: '7px 11px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  cursor: 'pointer',
}));

const DeleteButton = styled(EditButton)(({ theme }: { theme: Theme }) => ({
  color: theme.color.alertText,
}));

const Empty = styled.div(({ theme }) => ({
  padding: '30px 18px',
  textAlign: 'center' as const,
  fontSize: theme.fontSize.body,
  color: theme.semantic.textMuted,
}));

const MoreButton = styled.button(({ theme }) => ({
  width: '100%',
  padding: 13,
  border: 'none',
  borderTop: `1px solid ${theme.semantic.divider}`,
  backgroundColor: theme.semantic.bgSunken,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.bold,
  color: theme.color.navyDeep,
  cursor: 'pointer',
  '&:disabled': { opacity: 0.6, cursor: 'default' },
}));
