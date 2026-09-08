import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useAtomValue } from 'jotai';
import { scale } from '@common/shared';
import { textScaleAtom } from '../../store/textScale';
import { FONT_FAMILY, type FontWeightName } from '../../constant/fonts';

type FontStep = keyof typeof scale.mobile.step;

type StyleFactoryArgs = {
  fontSize: (step: FontStep) => number;
  fontFamily: (weight: FontWeightName) => string;
};

const fontFamily = (weight: FontWeightName) => FONT_FAMILY[weight];

const useStyles = <T extends StyleSheet.NamedStyles<T>>(factory: (args: StyleFactoryArgs) => T): T => {
  const textScale = useAtomValue(textScaleAtom);

  return useMemo(() => {
    const fontSize = (step: FontStep) => scale.mobile.base * scale.mobile.step[step] * textScale;

    return StyleSheet.create(factory({ fontSize, fontFamily }));
    // factory는 매 렌더마다 새로 만들어지는 인라인 함수로 쓰는 걸 전제로 함
    // (정적 토큰 + 주입된 fontSize/fontFamily만 참조, 외부 상태를 클로저로 안 잡음)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textScale]);
};

export default useStyles;
