import { useState } from 'react';
import styled from '@emotion/styled';
import type { CourseData } from '@common/shared';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import PrimaryButton from '../../components/ui/PrimaryButton';
import useTeacherOptions from '../../hooks/useTeacherOptions';
import { getPatchErrorMessage } from '../../hooks/useOptimisticPatch';
import useGetCourses from '../../hooks/api/course/useGetCourses';
import useCreateCourse from '../../hooks/api/course/useCreateCourse';
import useUpdateCourse from '../../hooks/api/course/useUpdateCourse';
import useDeleteCourse from '../../hooks/api/course/useDeleteCourse';
import CourseList from './CourseList';
import CourseDetail from './CourseDetail';
import CourseRegisterForm from './CourseRegisterForm';
import type { CourseFieldValues } from './CourseFields';

const CoursesContent = ({ welfareId }: { welfareId: string }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CourseData | null>(null);

  const { data } = useGetCourses(welfareId);
  const courses = data?.data ?? [];
  const selectedCourse = courses.find(c => c._id === selectedCourseId) ?? courses[0] ?? null;

  const { options: teacherOptions, getTeacherInfo, needsTeacherReassignment } = useTeacherOptions(welfareId);

  const { mutate: createMutate, isPending: isCreating, error: createError } = useCreateCourse(welfareId);
  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = useUpdateCourse(welfareId);
  const {
    mutate: deleteMutate,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteCourse(welfareId);

  const handleSelectCourse = (course: CourseData) => {
    setSelectedCourseId(course._id);
    setEditingCourseId(null);
  };

  const handleEditToggle = () => {
    if (!selectedCourse) return;
    setEditingCourseId(prev => (prev === selectedCourse._id ? null : selectedCourse._id));
  };

  const handleSaveEdit = (values: CourseFieldValues) => {
    if (!selectedCourse) return;

    updateMutate(
      {
        courseId: selectedCourse._id,
        updatedAt: selectedCourse.updatedAt,
        name: values.name,
        schedule: values.schedule,
        place: values.place,
        teacher: values.teacher || null,
        cap: Number(values.cap) || selectedCourse.cap,
        from: values.from,
        to: values.to,
      },
      { onSuccess: () => setEditingCourseId(null) },
    );
  };

  const handleCreate = (fields: Parameters<typeof createMutate>[0]) => {
    createMutate(fields, { onSuccess: () => setIsWizardOpen(false) });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutate(deleteTarget._id);
  };

  const handleDeleteDialogClose = () => {
    if (selectedCourseId === deleteTarget?._id) {
      setSelectedCourseId(null);
    }
    setDeleteTarget(null);
    resetDelete();
  };

  return (
    <div>
      <TopRow>
        <Title>강좌 {courses.length}개</Title>
        {!isWizardOpen && <PrimaryButton onClick={() => setIsWizardOpen(true)}>강좌 등록</PrimaryButton>}
      </TopRow>

      {isWizardOpen && (
        <CourseRegisterForm
          teacherOptions={teacherOptions}
          onSubmit={handleCreate}
          onCancel={() => setIsWizardOpen(false)}
          isSaving={isCreating}
          errorMessage={createError ? getPatchErrorMessage(createError) : null}
        />
      )}

      <Grid>
        <CourseList
          welfareId={welfareId}
          courses={courses}
          selectedId={selectedCourse?._id ?? null}
          onSelectCourse={handleSelectCourse}
          getTeacherInfo={getTeacherInfo}
          needsTeacherReassignment={needsTeacherReassignment}
        />

        {selectedCourse && (
          <CourseDetail
            welfareId={welfareId}
            course={selectedCourse}
            isEditing={editingCourseId === selectedCourse._id}
            onEditToggle={handleEditToggle}
            onSave={handleSaveEdit}
            onCancelEdit={() => setEditingCourseId(null)}
            isSaving={isUpdating}
            errorMessage={updateError ? getPatchErrorMessage(updateError) : null}
            onDelete={() => setDeleteTarget(selectedCourse)}
            teacherOptions={teacherOptions}
            getTeacherInfo={getTeacherInfo}
            needsTeacherReassignment={needsTeacherReassignment}
          />
        )}
      </Grid>

      <ConfirmDialog
        open={deleteTarget !== null}
        title={deleteTarget ? `${deleteTarget.name}을(를) 삭제하면 관련 대화방도 함께 사라집니다. 삭제하시겠습니까?` : ''}
        successMessage="삭제되었습니다"
        errorMessage={deleteError ? getPatchErrorMessage(deleteError) : null}
        isPending={isDeleting}
        isSuccess={isDeleteSuccess}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        onClose={handleDeleteDialogClose}
      />
    </div>
  );
};

export default CoursesContent;

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

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1.25fr',
  gap: 16,
  alignItems: 'start',
});
