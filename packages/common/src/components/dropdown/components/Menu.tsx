import type { Theme } from '@emotion/react';
import { css, useTheme } from '@emotion/react';
import { PropsWithChildren } from 'react';

type FixedDir = 'left' | 'right';

export interface Prop {
  isOpen: boolean;
  onClose: () => void;
  fixedDir: FixedDir;
  distance: number;
}

const Menu = ({
  children,
  isOpen,
  fixedDir,
  distance,
}: PropsWithChildren<Prop>) => {
  const theme = useTheme();

  return <div css={menuCss(theme, isOpen, fixedDir, distance)}>{children}</div>;
};

export default Menu;

const menuCss = (
  theme: Theme,
  isDropdownOpen: boolean,
  fixedDir: FixedDir,
  distance: number,
) => css`
  display: ${isDropdownOpen ? 'block' : 'none'};
  position: absolute;
  z-index: ${theme.zIndex.modal};
  top: ${distance}px;
  ${fixedDir}: 0;

  flex-direction: column;
  max-width: ${theme.maxWidths.mobile}px;
  width: 100%;
  border-radius: 10px;
`;
