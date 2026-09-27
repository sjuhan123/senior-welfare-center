import { Link } from 'react-router';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import Card from '../../components/ui/Card';
import CardHeader from '../../components/ui/CardHeader';

export type TodoTag = '신청' | '회원' | '식단' | '대화방';

export type Todo = {
  key: string;
  tag: TodoTag;
  text: string;
  cta: string;
  to: string;
};

const TAG_COLOR: Record<TodoTag, { bg: (theme: Theme) => string; fg: (theme: Theme) => string }> = {
  신청: { bg: theme => theme.color.navySoft, fg: theme => theme.color.navyDeep },
  회원: { bg: theme => theme.color.brownMark, fg: () => '#fff' },
  식단: { bg: theme => theme.color.grey150, fg: theme => theme.semantic.textSecondary },
  대화방: { bg: theme => theme.color.grey150, fg: theme => theme.semantic.textSecondary },
};

const HomeTodoList = ({ todos }: { todos: Todo[] }) => {
  return (
    <Card>
      <CardHeader>처리할 일</CardHeader>
      {todos.length === 0 ? (
        <Empty>지금 처리할 일이 없습니다</Empty>
      ) : (
        todos.map(todo => (
          <Row key={todo.key}>
            <Tag tagKey={todo.tag}>{todo.tag}</Tag>
            <Text>{todo.text}</Text>
            <CtaLink to={todo.to}>{todo.cta}</CtaLink>
          </Row>
        ))
      )}
    </Card>
  );
};

export default HomeTodoList;

const Row = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 18px',
  borderBottom: `1px solid ${theme.semantic.divider}`,
}));

const Tag = styled.span<{ tagKey: TodoTag }>(({ theme, tagKey }) => ({
  flex: 'none',
  padding: '3px 8px',
  borderRadius: 4,
  backgroundColor: TAG_COLOR[tagKey].bg(theme),
  color: TAG_COLOR[tagKey].fg(theme),
  fontSize: theme.fontSize.caption,
  fontWeight: theme.font.weight.bold,
}));

const Text = styled.span(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  fontSize: theme.fontSize.bodyStrong,
  fontWeight: theme.font.weight.semibold,
}));

const CtaLink = styled(Link)(({ theme }: { theme: Theme }) => ({
  flex: 'none',
  padding: '8px 13px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textPrimary,
  textDecoration: 'none',
}));

const Empty = styled.div(({ theme }) => ({
  padding: '30px 18px',
  textAlign: 'center' as const,
  fontSize: theme.fontSize.body,
  color: theme.semantic.textMuted,
}));
