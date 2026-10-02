import { useState } from 'react';
import styled from '@emotion/styled';
import type { LostItemData } from '@common/shared';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import useGetLostItems from '../../hooks/api/lostItem/useGetLostItems';
import useCreateLostItem, { type LostItemFields } from '../../hooks/api/lostItem/useCreateLostItem';
import useUpdateLostItem from '../../hooks/api/lostItem/useUpdateLostItem';
import useDeleteLostItem from '../../hooks/api/lostItem/useDeleteLostItem';
import { getPatchErrorMessage } from '../../hooks/useOptimisticPatch';
import LostList from './LostList';
import LostForm from './LostForm';

const EMPTY_FIELDS: LostItemFields = { item: '', where: '', when: '', keep: '', notifyNotice: false };

const LostContent = ({ welfareId }: { welfareId: string }) => {
  const [editingItem, setEditingItem] = useState<LostItemData | null>(null);
  const [fields, setFields] = useState<LostItemFields>(EMPTY_FIELDS);
  const [deleteTarget, setDeleteTarget] = useState<LostItemData | null>(null);

  const { data } = useGetLostItems(welfareId);
  const lostItems = data?.data ?? [];

  const { mutate: createMutate, isPending: isCreating, error: createError } = useCreateLostItem(welfareId);
  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = useUpdateLostItem(welfareId);
  const {
    mutate: deleteMutate,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteLostItem(welfareId);

  const handleSelectItem = (item: LostItemData) => {
    setEditingItem(item);
    setFields({ item: item.item, where: item.where, when: item.when, keep: item.keep, notifyNotice: item.notifyNotice });
  };

  const handleFieldChange = (key: keyof LostItemFields, value: string | boolean) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFields(EMPTY_FIELDS);
  };

  const handleSave = () => {
    if (!fields.item.trim()) return;

    if (editingItem) {
      updateMutate({ lostItemId: editingItem._id, updatedAt: editingItem.updatedAt, ...fields }, { onSuccess: () => handleCancel() });
      return;
    }

    createMutate(fields, { onSuccess: () => setFields(EMPTY_FIELDS) });
  };

  const handleToggleClaimed = (item: LostItemData) => {
    updateMutate({ lostItemId: item._id, updatedAt: item.updatedAt, claimed: !item.claimed });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutate({ lostItemId: deleteTarget._id, updatedAt: deleteTarget.updatedAt });
  };

  const handleDeleteDialogClose = () => {
    if (editingItem && deleteTarget && editingItem._id === deleteTarget._id) {
      handleCancel();
    }
    setDeleteTarget(null);
    resetDelete();
  };

  return (
    <Grid>
      <LostList
        lostItems={lostItems}
        selectedId={editingItem?._id ?? null}
        onSelectItem={handleSelectItem}
        onToggleClaimed={handleToggleClaimed}
        onDelete={setDeleteTarget}
      />
      <LostForm
        isEditing={!!editingItem}
        fields={fields}
        onFieldChange={handleFieldChange}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isCreating || isUpdating}
        errorMessage={createError ? getPatchErrorMessage(createError) : updateError ? getPatchErrorMessage(updateError) : null}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={deleteTarget ? `${deleteTarget.item} 을(를) 목록에서 지우시겠습니까? 앱에서도 바로 사라집니다.` : ''}
        successMessage="삭제되었습니다"
        errorMessage={deleteError ? getPatchErrorMessage(deleteError) : null}
        isPending={isDeleting}
        isSuccess={isDeleteSuccess}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        onClose={handleDeleteDialogClose}
      />
    </Grid>
  );
};

export default LostContent;

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: '1.45fr 1fr',
  gap: 16,
  alignItems: 'start',
});
