import Svg, { Line } from 'react-native-svg';
import { color } from '@common/shared';

// RN의 borderStyle:'dashed'는 한쪽 변만 줄 때(borderBottomWidth) iOS에서 아예 안 그려지는
// 경우가 있어서, 점선 구분선은 SVG로 직접 그린다.
const DashedDivider = () => (
  <Svg height={1} width="100%">
    <Line x1="0" y1="0.5" x2="100%" y2="0.5" stroke={color.grey400} strokeWidth={1} strokeDasharray="5,5" />
  </Svg>
);

export default DashedDivider;
