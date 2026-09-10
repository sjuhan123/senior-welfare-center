import { View, StyleSheet, Text } from 'react-native';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';
import { color } from '@common/shared';
import useStyles from '../hooks/styles/useStyles';

type Props = {
  size: number;
  borderRadius?: number;
  label: string;
};

// 사진/아바타가 없을 때 쓰는 사선 줄무늬 자리표시자.
// CSS의 repeating-linear-gradient(135deg, ...)를 RN엔 그대로 옮길 방법이
// 없어서(StyleSheet가 그라디언트 자체를 지원 안 함), SVG 패턴으로 대체.
const PlaceholderAvatar = ({ size, borderRadius = 0, label }: Props) => {
  const patternId = 'placeholder-stripes';

  const styles = useStyles(({ fontSize, fontFamily }) =>
    StyleSheet.create({
      container: {
        width: size,
        height: size,
        borderRadius,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: color.grey300,
      },
      labelWrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
      },
      label: {
        fontSize: fontSize('md'),
        fontFamily: fontFamily('bold'),
        color: color.grey600,
      },
    }),
  );

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Defs>
          <Pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width={14}
            height={14}
            patternTransform="rotate(135)"
          >
            <Rect width={14} height={14} fill="#e9ebee" />
            <Rect width={7} height={14} fill="#d9dde1" />
          </Pattern>
        </Defs>
        <Rect width={size} height={size} fill={`url(#${patternId})`} />
      </Svg>
      <View style={styles.labelWrap}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

export default PlaceholderAvatar;
