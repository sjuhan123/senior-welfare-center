import styled from '@emotion/styled';
import { MINUTE_OPTIONS, buildTime, parseTime, type Period } from './courseDisplay';

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

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
