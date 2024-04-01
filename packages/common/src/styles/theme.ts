import colors from './colors';
import typos from './typos';

const theme = {
  colors,
  typos,
  size: {
    maxWidth: '640px',
  },
} as const;

export default theme;
