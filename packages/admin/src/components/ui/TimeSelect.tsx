import styled from '@emotion/styled';

type Period = '오전' | '오후';

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTE_OPTIONS = [0, 10, 20, 30, 40, 50];

const parseTime = (time: string): { period: Period; hour: number; minute: number } => {
  if (!time) return { period: '오전', hour: 9, minute: 0 };

  const [hourStr, minuteStr] = time.split(':');
  const hour24 = Number(hourStr);
  const period: Period = hour24 < 12 ? '오전' : '오후';
  const hour = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return { period, hour, minute: Number(minuteStr) };
};

const buildTime = (period: Period, hour: number, minute: number) => {
  const hour24 = period === '오후' ? (hour % 12) + 12 : hour % 12;
  return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

type Props = {
  value: string;
  onChange: (time: string) => void;
};

const TimeSelect = ({ value, onChange }: Props) => {
  const { period, hour, minute } = parseTime(value);

  const handlePeriodChange = (next: Period) => onChange(buildTime(next, hour, minute));
  const handleHourChange = (next: number) => onChange(buildTime(period, next, minute));
  const handleMinuteChange = (next: number) => onChange(buildTime(period, hour, next));

  return (
    <Row>
      <Select value={period} onChange={e => handlePeriodChange(e.target.value as Period)}>
        <option value="오전">오전</option>
        <option value="오후">오후</option>
      </Select>
      <Select value={hour} onChange={e => handleHourChange(Number(e.target.value))}>
        {HOUR_OPTIONS.map(h => (
          <option key={h} value={h}>
            {h}시
          </option>
        ))}
      </Select>
      <Select value={minute} onChange={e => handleMinuteChange(Number(e.target.value))}>
        {MINUTE_OPTIONS.map(m => (
          <option key={m} value={m}>
            {String(m).padStart(2, '0')}분
          </option>
        ))}
      </Select>
    </Row>
  );
};

export default TimeSelect;

const Row = styled.div({
  display: 'flex',
  gap: 6,
});

const Select = styled.select(({ theme }) => ({
  height: theme.hit.input,
  padding: '0 8px',
  border: `1px solid ${theme.semantic.border}`,
  borderRadius: theme.radius.input,
  backgroundColor: theme.color.grey0,
  fontSize: theme.fontSize.body,
  fontWeight: theme.font.weight.medium,
}));
