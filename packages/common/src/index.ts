import colors from './styles/colors';
import defaultTheme from './styles/theme';
import { ITheme } from './styles/types';
import typos from './styles/typos';
import maxWidths from './styles/maxWidths';

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
