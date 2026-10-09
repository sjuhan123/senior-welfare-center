import { useState } from 'react';
import styled from '@emotion/styled';
import type { NoticeEntry } from '@common/shared';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { getPatchErrorMessage } from '../../hooks/useOptimisticPatch';
import useGetCourses from '../../hooks/api/course/useGetCourses';
import useGetRooms from '../../hooks/api/room/useGetRooms';
import useGetNotices from '../../hooks/api/notice/useGetNotices';
import useCreateNotice from '../../hooks/api/notice/useCreateNotice';
import useUpdateNotice from '../../hooks/api/notice/useUpdateNotice';
import useDeleteNotice from '../../hooks/api/notice/useDeleteNotice';
import NoticeForm from './components/NoticeForm';
import NoticeList from './components/NoticeList';

type EditingNotice = { roomId: string; messageId: string; updatedAt: string; text: string };

const NoticesContent = ({ welfareId }: { welfareId: string }) => {
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [editing, setEditing] = useState<EditingNotice | null>(null);
  const [resetKey, setResetKey] = useState(0);
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

  const handleSubmit = (text: string) => {
    if (editing) {
      updateNotice(
        { roomId: editing.roomId, messageId: editing.messageId, text, updatedAt: editing.updatedAt },
        { onSuccess: () => setEditing(null) },
      );
      return;
    }

    if (!targetRoomId) return;
    createNotice({ roomId: targetRoomId, text }, { onSuccess: () => setResetKey(prev => prev + 1) });
  };

  const handleEdit = (notice: NoticeEntry) => {
    setEditing({ roomId: notice.room, messageId: notice._id, updatedAt: notice.updatedAt, text: notice.text });
  };

  const handleCancelEdit = () => {
    setEditing(null);
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

      <NoticeForm
        key={editing ? editing.messageId : `new-${resetKey}`}
        isEditing={isEditing}
        initialText={editing ? editing.text : ''}
        targetRoomId={targetRoomId}
        targets={targets}
        onSelectRoom={setSelectedRoomId}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
        isSaving={isSaving}
        errorMessage={formError ? getPatchErrorMessage(formError) : null}
      />

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

const ListWrapper = styled.div({
  marginTop: 16,
});
