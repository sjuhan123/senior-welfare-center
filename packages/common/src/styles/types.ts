/* eslint-disable no-unused-vars */
import type { Keyframes } from '@emotion/react';

export interface ITheme {
  colors: {
    gray_100: string;
    gray_200: string;
    gray_300: string;
    blue_100: string;
    blue_200: string;
    black: string;
    white: string;
  };
  maxWidths: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  animations: {
    pulse: Keyframes;
  };
  zIndex: {
    toast: number;
    modal: number;
    dropdown: number;
    aboveDefault: number;
    default: number;
    belowDefault: number;
    above: (n: number) => number;
    below: (n: number) => number;
  };
}
