import { useState } from 'react';
import styled from '@emotion/styled';
import type { CourseData } from '@common/shared';
import type { TeacherStatus } from '../../../../hooks/useTeacherOptions';
import CourseRow from './CourseRow';

type Props = {
  welfareId: string;
  courses: CourseData[];
  selectedId: string | null;
  onSelectCourse: (course: CourseData) => void;
  getTeacherInfo: (teacherId: string | null) => { name: string; status: TeacherStatus } | null;
  needsTeacherReassignment: (teacherId: string | null) => boolean;
};

const CourseList = ({ welfareId, courses, selectedId, onSelectCourse, getTeacherInfo, needsTeacherReassignment }: Props) => {
  const [query, setQuery] = useState('');
  const [teacherGoneOnly, setTeacherGoneOnly] = useState(false);

  const goneCount = courses.filter(course => needsTeacherReassignment(course.teacher)).length;

  const filtered = courses
    .filter(course => !teacherGoneOnly || needsTeacherReassignment(course.teacher))
    .filter(course => {
      if (!query.trim()) return true;
      const teacherName = getTeacherInfo(course.teacher)?.name ?? '';
      return course.name.includes(query) || teacherName.includes(query);
    });

  return (
    <Card>
      <Header>
        <HeaderRow>
          <Title>강좌 목록</Title>
          <Count>
            {filtered.length} / {courses.length}개
          </Count>
          {goneCount > 0 && (
            <GoneChip active={teacherGoneOnly} onClick={() => setTeacherGoneOnly(prev => !prev)}>
              {teacherGoneOnly ? '거르개 해제' : `선생님 없음 ${goneCount}`}
            </GoneChip>
          )}
        </HeaderRow>
        <SearchInput value={query} onChange={e => setQuery(e.target.value)} placeholder="강좌명이나 선생님" />
      </Header>

      <List>
        {filtered.length === 0 ? (
          <Empty>
            찾는 강좌가 없습니다
            {teacherGoneOnly && <ResetButton onClick={() => setTeacherGoneOnly(false)}>전체 강좌 보기</ResetButton>}
          </Empty>
        ) : (
          filtered.map(course => (
            <CourseRow
              key={course._id}
              welfareId={welfareId}
              course={course}
              active={course._id === selectedId}
              teacherInfo={getTeacherInfo(course.teacher)}
              needsReassignment={needsTeacherReassignment(course.teacher)}
              onSelect={() => onSelectCourse(course)}
            />
          ))
        )}
      </List>
    </Card>
  );
};

export default CourseList;

const Card = styled.div(({ theme }) => ({
  backgroundColor: theme.color.grey0,
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.card,
}));

const Header = styled.div(({ theme }) => ({
  padding: '14px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

const HeaderRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

const Title = styled.span(({ theme }) => ({
  flex: 1,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.bold,
}));

const Count = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.small,
  color: theme.semantic.textMuted,
}));

const GoneChip = styled.button<{ active: boolean }>(({ theme, active }) => ({
  padding: '3px 8px',
  border: `1px solid ${active ? theme.color.alert : theme.color.alertLine}`,
  borderRadius: theme.radius.badge,
  backgroundColor: active ? theme.color.alert : theme.color.alertTint,
  color: active ? theme.color.grey0 : theme.color.alertText,
  fontSize: theme.fontSize.caption,
  fontWeight: theme.font.weight.bold,
  cursor: 'pointer',
}));

const SearchInput = styled.input(({ theme }) => ({
  width: '100%',
  height: 34,
  marginTop: 9,
  padding: '0 10px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.small,
}));

const List = styled.div({
  maxHeight: 560,
  overflowY: 'auto' as const,
});

const Empty = styled.div(({ theme }) => ({
  padding: '30px 18px',
  textAlign: 'center' as const,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textSecondary,
}));

const ResetButton = styled.button(({ theme }) => ({
  display: 'block',
  margin: '12px auto 0',
  padding: '8px 14px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.bold,
  color: theme.color.navy,
  cursor: 'pointer',
}));
