import styled from '@emotion/styled';

type Stat = { name: string; value: string; delta: string };

const HomeStats = ({ stats }: { stats: Stat[] }) => {
  return (
    <Grid>
      {stats.map(stat => (
        <Card key={stat.name}>
          <Name>{stat.name}</Name>
          <ValueRow>
            <Value>{stat.value}</Value>
            {stat.delta && <Delta>{stat.delta}</Delta>}
          </ValueRow>
        </Card>
      ))}
    </Grid>
  );
};

export default HomeStats;

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 14,
});

const Card = styled.div(({ theme }) => ({
  backgroundColor: theme.color.grey0,
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.card,
  padding: '16px 18px',
}));

const Name = styled.div(({ theme }) => ({
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.semantic.textMuted,
}));

const ValueRow = styled.div({
  display: 'flex',
  alignItems: 'baseline',
  gap: 7,
  marginTop: 8,
});

const Value = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.pageTitle,
  fontWeight: theme.font.weight.bold,
  letterSpacing: '-0.01em',
}));

const Delta = styled.span(({ theme }) => ({
  fontSize: theme.fontSize.small,
  fontWeight: theme.font.weight.semibold,
  color: theme.color.brownMark,
}));
