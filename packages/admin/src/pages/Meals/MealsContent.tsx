import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import useGetMeals from '../../hooks/api/meal/useGetMeals';
import useUpsertMeal from '../../hooks/api/meal/useUpsertMeal';
import useDeleteMeal from '../../hooks/api/meal/useDeleteMeal';
import { getMeals } from '../../hooks/api/meal/useGetMeals';
import { upsertMeal } from '../../hooks/api/meal/useUpsertMeal';
import { getPatchErrorMessage } from '../../hooks/useOptimisticPatch';
import { QUERY_KEYS } from '../../constant/queryKeys';
import MealCalendar from './MealCalendar';
import MealDetailPanel from './MealDetailPanel';
import { shiftDate, toIso, weekOf } from './mealDate';

const TODAY_ISO = toIso(new Date());
const TODAY_MONTH = TODAY_ISO.slice(0, 7);

const shiftMonth = (month: string, delta: number) => {
  const year = Number(month.slice(0, 4));
  const monthIndex = Number(month.slice(5, 7)) - 1 + delta;
  const date = new Date(year, monthIndex, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const MealsContent = ({ welfareId }: { welfareId: string }) => {
  const queryClient = useQueryClient();
  const [month, setMonth] = useState(TODAY_MONTH);
  const [selectedDate, setSelectedDate] = useState(TODAY_ISO);
  const [draftItems, setDraftItems] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { data } = useGetMeals(welfareId, month);
  const meals = data?.data ?? [];
  const selectedMeal = meals.find(meal => meal.date === selectedDate);

  const { mutate: upsertMutate, isPending: isSaving, error: saveError } = useUpsertMeal(welfareId, month);
  const {
    mutate: deleteMutate,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteMeal(welfareId, month);

  useEffect(() => {
    if (isDirty) return;
    setDraftItems(selectedMeal ? selectedMeal.items.join('\n') : '');
  }, [selectedDate, selectedMeal, isDirty]);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setIsDirty(false);
  };

  const handleDraftItemsChange = (value: string) => {
    setDraftItems(value);
    setIsDirty(true);
  };

  const handleSave = () => {
    const items = draftItems
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    if (items.length === 0) return;

    upsertMutate({ date: selectedDate, items, updatedAt: selectedMeal?.updatedAt }, { onSuccess: () => setIsDirty(false) });
  };

  const handleConfirmDelete = () => {
    if (!selectedMeal) return;
    deleteMutate({ mealId: selectedMeal._id, date: selectedMeal.date, updatedAt: selectedMeal.updatedAt });
  };

  const handleDeleteDialogClose = () => {
    setConfirmDeleteOpen(false);
    resetDelete();
    setIsDirty(false);
  };

  const handleCopyLastWeek = async () => {
    const thisWeek = weekOf(selectedDate);
    const lastWeek = thisWeek.map(iso => shiftDate(iso, -7));
    const months = Array.from(new Set([...thisWeek, ...lastWeek].map(iso => iso.slice(0, 7))));
    const results = await Promise.all(months.map(m => getMeals(welfareId, m)));
    const mealsByDate = new Map(results.flatMap(res => res.data).map(meal => [meal.date, meal]));

    const sourceDates = lastWeek.filter(iso => mealsByDate.has(iso));
    if (sourceDates.length === 0) {
      window.alert('지난주에 등록된 식단이 없습니다.');
      return;
    }
    if (!window.confirm(`지난주 식단 ${sourceDates.length}일치를 이번 주로 복사합니다. 이미 등록된 날은 덮어씁니다.`)) return;

    await Promise.all(
      thisWeek.map((targetDate, i) => {
        const sourceMeal = mealsByDate.get(lastWeek[i]);
        if (!sourceMeal) return Promise.resolve();
        const existing = mealsByDate.get(targetDate);
        return upsertMeal(welfareId, { date: targetDate, items: sourceMeal.items, updatedAt: existing?.updatedAt });
      }),
    );

    void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEALS, welfareId] });
    setIsDirty(false);
  };

  return (
    <Grid>
      <MealCalendar
        month={month}
        selectedDate={selectedDate}
        todayIso={TODAY_ISO}
        meals={meals}
        onPrevMonth={() => setMonth(prev => shiftMonth(prev, -1))}
        onNextMonth={() => setMonth(prev => shiftMonth(prev, 1))}
        onThisMonth={() => {
          setMonth(TODAY_MONTH);
          handleSelectDate(TODAY_ISO);
        }}
        onSelectDate={handleSelectDate}
        onCopyLastWeek={handleCopyLastWeek}
      />
      <MealDetailPanel
        selectedDate={selectedDate}
        meals={meals}
        draftItems={draftItems}
        onDraftItemsChange={handleDraftItemsChange}
        onSave={handleSave}
        onDelete={() => setConfirmDeleteOpen(true)}
        onSelectDate={handleSelectDate}
        isSaving={isSaving}
        errorMessage={saveError ? getPatchErrorMessage(saveError) : null}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title={selectedMeal ? `${selectedDate} 식단을 삭제하시겠습니까?` : ''}
        successMessage="삭제되었습니다"
        errorMessage={deleteError ? getPatchErrorMessage(deleteError) : null}
        isPending={isDeleting}
        isSuccess={isDeleteSuccess}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
        onClose={handleDeleteDialogClose}
      />
    </Grid>
  );
};

export default MealsContent;

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: '1.55fr 1fr',
  gap: 16,
  alignItems: 'start',
});
