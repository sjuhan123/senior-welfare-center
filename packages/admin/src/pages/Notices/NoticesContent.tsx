import { useState } from 'react';
import styled from '@emotion/styled';
import type { NoticeEntry } from '@common/shared';
import Card from '../../components/ui/Card';
import CardHeader from '../../components/ui/CardHeader';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { getPatchErrorMessage } from '../../hooks/useOptimisticPatch';
import useGetCourses from '../../hooks/api/course/useGetCourses';
import useGetRooms from '../../hooks/api/room/useGetRooms';
import useGetNotices from '../../hooks/api/notice/useGetNotices';
import useCreateNotice from '../../hooks/api/notice/useCreateNotice';
import useUpdateNotice from '../../hooks/api/notice/useUpdateNotice';
import useDeleteNotice from '../../hooks/api/notice/useDeleteNotice';
import NoticeList from './NoticeList';

type EditingNotice = { roomId: string; messageId: string; updatedAt: string };

const NoticesContent = ({ welfareId }: { welfareId: string }) => {
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [noticeText, setNoticeText] = useState('');
  const [editing, setEditing] = useState<EditingNotice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NoticeEntry | null>(null);

  const { data: coursesData } = useGetCourses(welfareId);
  const openCourses = (coursesData?.data ?? []).filter(course => !course.endedAt);
  const courseNameById = new Map(openCourses.map(course => [course._id, course.name]));

  const { data: roomsData } = useGetRooms(welfareId);
  const targets = (roomsData?.data ?? [])
    .map(entry => entry.room)
    .filter(room => room.type === 'notice')
    .filter(room => !room.course || courseNameById.has(room.course))
    .map(room => ({ id: room._id, label: room.course ? `${courseNameById.get(room.course)} 공지방` : '복지관 공지방' }));

  const targetRoomId = selectedRoomId || targets[0]?.id || '';

  const { data: noticesData, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetNotices(welfareId);
  const notices = noticesData?.pages.flatMap(page => page.data) ?? [];

  const { mutate: createNotice, isPending: isCreating, error: createError } = useCreateNotice(welfareId);
  const { mutate: updateNotice, isPending: isUpdating, error: updateError } = useUpdateNotice(welfareId);
  const {
    mutate: deleteNotice,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteNotice(welfareId);

  const isEditing = editing !== null;
  const isSaving = isEditing ? isUpdating : isCreating;
  const formError = isEditing ? updateError : createError;

  const handleSubmit = () => {
    if (!noticeText.trim()) return;

    if (editing) {
      updateNotice(
        { roomId: editing.roomId, messageId: editing.messageId, text: noticeText, updatedAt: editing.updatedAt },
        {
          onSuccess: () => {
            setEditing(null);
            setNoticeText('');
          },
        },
      );
      return;
    }

    if (!targetRoomId) return;
    createNotice({ roomId: targetRoomId, text: noticeText }, { onSuccess: () => setNoticeText('') });
  };

  const handleEdit = (notice: NoticeEntry) => {
    setEditing({ roomId: notice.room, messageId: notice._id, updatedAt: notice.updatedAt });
    setNoticeText(notice.text);
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setNoticeText('');
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteNotice({ roomId: deleteTarget.room, messageId: deleteTarget._id });
  };

  return (
    <div>
      <TopRow>
        <Title>공지 관리</Title>
      </TopRow>

      <Card>
        <CardHeader>{isEditing ? '공지 수정' : '공지 등록'}</CardHeader>
        <Form>
          <Select value={targetRoomId} onChange={e => setSelectedRoomId(e.target.value)} disabled={isEditing}>
            {targets.map(target => (
              <option key={target.id} value={target.id}>
                {target.label}
              </option>
            ))}
          </Select>
          <Textarea value={noticeText} onChange={e => setNoticeText(e.target.value)} placeholder="공지 내용" />
          <PrimaryButton onClick={handleSubmit} disabled={isSaving || !noticeText.trim() || !targetRoomId}>
            {isSaving ? '저장 중...' : isEditing ? '수정 저장' : '등록하고 발송'}
          </PrimaryButton>
          {isEditing && <SecondaryButton onClick={handleCancelEdit}>수정 취소</SecondaryButton>}
        </Form>
        {formError && <ErrorText>{getPatchErrorMessage(formError)}</ErrorText>}
      </Card>

      <ListWrapper>
        <NoticeList
          notices={notices}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
          hasMore={!!hasNextPage}
          isLoadingMore={isFetchingNextPage}
          onLoadMore={() => void fetchNextPage()}
        />
      </ListWrapper>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="이 공지를 삭제하면 회원 앱에서도 사라집니다. 삭제하시겠습니까?"
        successMessage="삭제되었습니다"
        errorMessage={deleteError ? getPatchErrorMessage(deleteError) : null}
        isPending={isDeleting}
        isSuccess={isDeleteSuccess}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        onClose={() => {
          setDeleteTarget(null);
          resetDelete();
        }}
      />
    </div>
  );
};

export default NoticesContent;

const TopRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 14,
});

const Title = styled.span(({ theme }) => ({
  flex: 1,
  fontSize: theme.fontSize.title,
  fontWeight: theme.font.weight.bold,
}));

const Form = styled.div({
  display: 'flex',
  gap: 10,
  alignItems: 'flex-start',
  padding: '15px 18px',
});

const Select = styled.select(({ theme }) => ({
  flex: 'none',
  width: 186,
  height: 40,
  padding: '0 10px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.medium,
  '&:disabled': { opacity: 0.6 },
}));

const Textarea = styled.textarea(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  height: 76,
  padding: '10px 12px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.medium,
  resize: 'vertical' as const,
}));

const ErrorText = styled.div(({ theme }) => ({
  padding: '0 18px 15px',
  fontSize: theme.fontSize.small,
  color: theme.color.alertText,
}));

const ListWrapper = styled.div({
  marginTop: 16,
});
