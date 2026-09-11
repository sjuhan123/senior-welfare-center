import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useAtomValue } from 'jotai';
import { scale } from '@common/shared';
import { textScaleAtom } from '../../store/textScale';
import { FONT_FAMILY, type FontWeightName } from '../../constant/fonts';

type FontStep = keyof typeof scale.mobile.step;

export type StyleFactoryArgs = {
  fontSize: (step: FontStep) => number;
  fontFamily: (weight: FontWeightName) => string;
};

const fontFamily = (weight: FontWeightName) => FONT_FAMILY[weight];

const useStyles = <T extends StyleSheet.NamedStyles<T>>(factory: (args: StyleFactoryArgs) => T): T => {
  const textScale = useAtomValue(textScaleAtom);

  return useMemo(() => {
    const fontSize = (step: FontStep) => scale.mobile.base * scale.mobile.step[step] * textScale;

    return StyleSheet.create(factory({ fontSize, fontFamily }));
    // factory는 컴포넌트 파일 하단에 선언된 모듈 스코프 함수를 참조로 넘기는 걸 전제로 함
    // (정적 토큰 + 주입된 fontSize/fontFamily만 참조, 외부 상태를 클로저로 안 잡음 — 스코프상 강제됨)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textScale]);
};

export default useStyles;
