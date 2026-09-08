import colors from './styles/colors';
import defaultTheme from './styles/theme';
import { ITheme } from './styles/types';
import typos from './styles/typos';
import maxWidths from './styles/maxWidths';
import {
  color,
  semantic,
  font,
  lineHeight,
  scale,
  space,
  radius,
  border,
  hit,
} from './styles/tokens';
import type { Color, Semantic } from './styles/tokens';

import Button from './components/button/Button';
import CircleButton from './components/button/CircleButton';
import EllipseButton from './components/button/EllipseButton';

import Modal from './components/modal/Modal';
import { Dropdown } from './components/dropdown';

import useClickOutside from './hooks/interaction/useClickOutside';
import useDisclosure from './hooks/disclosure/useDisclosure';

/**
 * styles
 */

export type ThemeType = ITheme;
export { colors, defaultTheme };
export { typos };
export { maxWidths };

/**
 * design tokens (09.05 디자인 검토 기준 신규 토큰)
 */

export { color, semantic, font, lineHeight, scale, space, radius, border, hit };
export type { Color, Semantic };

/**
 * commcomponents
 */

export { Button };
export { CircleButton };
export { EllipseButton };

export { Modal };
export { Dropdown };

/**
 * hooks
 */

export { useClickOutside };
export { useDisclosure };
