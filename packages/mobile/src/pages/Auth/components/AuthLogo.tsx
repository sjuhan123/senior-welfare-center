import Svg, { Path } from 'react-native-svg';

type Props = { size: number };

const AuthLogo = ({ size }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Path
      d="M50 12 L86.5 39.5 Q88 40.7 88 42.6 L88 84 Q88 89 83 89 L17 89 Q12 89 12 84 L12 42.6 Q12 40.7 13.5 39.5 Z"
      fill="#415270"
      stroke="#415270"
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <Path d="M31 56 Q50 86 69 56" fill="none" stroke="#f9f4ec" strokeWidth={8.5} strokeLinecap="round" />
  </Svg>
);

export default AuthLogo;
