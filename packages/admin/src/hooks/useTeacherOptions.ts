import { useMemo } from 'react';
import useGetWelfareMembers from './api/membership/useGetWelfareMembers';

export type TeacherOption = { value: string; label: string; disabled: boolean };
export type TeacherStatus = 'active' | 'inactive' | 'unknown';

const useTeacherOptions = (welfareId: string) => {
  const { data, isLoading } = useGetWelfareMembers(welfareId, { filter: 'teacher', search: '', sort: 'desc', page: 1, limit: 200 });
  const teachers = useMemo(() => data?.data.members ?? [], [data]);

  const options = useMemo<TeacherOption[]>(
    () => [
      { value: '', label: '아직 정하지 않음', disabled: false },
      ...teachers.map(teacher => ({
        value: teacher.userId,
        label: teacher.active ? teacher.userName : `${teacher.userName} (비활성 · 고를 수 없음)`,
        disabled: !teacher.active,
      })),
    ],
    [teachers],
  );

  const getTeacherInfo = (teacherId: string | null): { name: string; status: TeacherStatus } | null => {
    if (!teacherId) return null;

    const found = teachers.find(teacher => teacher.userId === teacherId);
    if (!found) return { name: teacherId, status: 'unknown' };

    return { name: found.userName, status: found.active ? 'active' : 'inactive' };
  };

  // 미정이거나(getTeacherInfo가 null), 배정은 됐지만 활성 상태가 아니면(비활성·등록안됨) 재배정이 필요함
  const needsTeacherReassignment = (teacherId: string | null) => {
    const info = getTeacherInfo(teacherId);
    return !info || info.status !== 'active';
  };

  return { isLoading, options, getTeacherInfo, needsTeacherReassignment };
};

export default useTeacherOptions;
