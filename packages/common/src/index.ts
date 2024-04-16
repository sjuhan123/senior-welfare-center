import colors from './styles/colors';
import defaultTheme from './styles/theme';
import { ITheme } from './styles/types';
import typos from './styles/typos';
import maxWidths from './styles/maxWidths';

import Button from './components/button/Button';
import CircleButton from './components/button/CircleButton';
import EllipseButton from './components/button/EllipseButton';

export type ThemeType = ITheme;
export { colors, defaultTheme };
export { typos };
export { maxWidths };

export { Button };
export { CircleButton };
export { EllipseButton };
