import type { SerializedStyles } from '@emotion/react';

export interface ITheme {
  colors: {
    gray_100: string;
    gray_200: string;
    gray_300: string;
    green_100: string;
    green_200: string;
    green_300: string;
    black: string;
    white: string;
  };
  size: {
    maxWidth: string;
  };
  typo: {
    HEAD: SerializedStyles;
    BODY: SerializedStyles;
    DETAIL: SerializedStyles;
  };
}
