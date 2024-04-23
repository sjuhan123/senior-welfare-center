import type { Theme } from '@emotion/react';
import { css, useTheme } from '@emotion/react';
import { PropsWithChildren, useRef } from 'react';
import { useDropdownContext } from '../contexts/DropdownContext';
import useClickOutside from '../../../hooks/interaction/useClickOutside';

type FixedDir = 'left' | 'right';

export interface Prop {
  children: React.ReactNode;
  fixedDir: FixedDir;
  distance: number;
  onClickOutside?: () => void;
}

const Menu = ({
  children,
  fixedDir,
  distance,
  onClickOutside,
}: PropsWithChildren<Prop>) => {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const { isDropdownOpen, toggleDropdown } = useDropdownContext();

  useClickOutside(ref, () => {
    if (isDropdownOpen) {
      toggleDropdown();
      onClickOutside?.();
    }
  });

  return (
    <div css={menuCss(theme, isDropdownOpen, fixedDir, distance)} ref={ref}>
      {children}
    </div>
  );
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
