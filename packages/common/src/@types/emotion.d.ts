import type { ITheme } from 'src/styles/types';

declare module '@emotion/react' {
  export interface Theme extends ITheme {}
}
