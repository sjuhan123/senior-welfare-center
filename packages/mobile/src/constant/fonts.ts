import {
  IBMPlexSansKR_400Regular,
  IBMPlexSansKR_500Medium,
  IBMPlexSansKR_600SemiBold,
  IBMPlexSansKR_700Bold,
} from '@expo-google-fonts/ibm-plex-sans-kr';

// expo-font의 useFonts에 그대로 전달. RN은 웹과 달리 굵기별로 별도 폰트
// 파일을 로드해야 해서(font-family + font-weight 조합이 안 통함), 굵기
// 이름 -> 실제 로드된 폰트 패밀리명 매핑도 같이 둠(FONT_FAMILY).
export const FONT_ASSETS = {
  IBMPlexSansKR_400Regular,
  IBMPlexSansKR_500Medium,
  IBMPlexSansKR_600SemiBold,
  IBMPlexSansKR_700Bold,
};

export const FONT_FAMILY = {
  regular: 'IBMPlexSansKR_400Regular',
  medium: 'IBMPlexSansKR_500Medium',
  semibold: 'IBMPlexSansKR_600SemiBold',
  bold: 'IBMPlexSansKR_700Bold',
} as const;

export type FontWeightName = keyof typeof FONT_FAMILY;
