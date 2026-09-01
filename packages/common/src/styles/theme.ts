import animations from './animations';
import colors from './colors';
import maxWidths from './maxWidths';
import zIndex from './zIndex';

const theme = {
  colors,
  maxWidths,
  animations,
  zIndex,
} as const;

export default theme;
