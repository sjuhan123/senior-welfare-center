import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { ApiException } from '../exceptions/apiException';

type OptimisticPatchOptions<TData, TVars> = {
  queryKey: QueryKey;
  patchFn: (_vars: TVars) => Promise<unknown>;
  applyOptimistic: (_previous: TData, _vars: TVars) => TData;
  extraInvalidateKeys?: QueryKey[];
};

const useOptimisticPatch = <TData, TVars>({ queryKey, patchFn, applyOptimistic, extraInvalidateKeys = [] }: OptimisticPatchOptions<TData, TVars>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchFn,
    onMutate: async (vars: TVars) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TData>(queryKey);

      if (previous) {
        queryClient.setQueryData<TData>(queryKey, applyOptimistic(previous, vars));
      }

      return { previous };
    },
    onError: (error, _vars, context) => {
      if (error instanceof ApiException && error.status === 409) return;
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
      extraInvalidateKeys.forEach(key => void queryClient.invalidateQueries({ queryKey: key }));
    },
  });
};

export default useOptimisticPatch;

export const getPatchErrorMessage = (error: unknown) => {
  if (error instanceof ApiException) {
    if (error.status === 409) return '다른 관리자가 방금 변경했습니다. 최신 값으로 갱신했습니다.';
    return error.message || '변경에 실패했습니다.';
  }

  return '변경에 실패했습니다.';
};
