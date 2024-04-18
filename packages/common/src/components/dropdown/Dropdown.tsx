import type { Theme } from '@emotion/react';
import { css, useTheme } from '@emotion/react';
import { useRef, PropsWithChildren } from 'react';

type FixedDir = 'left' | 'right';

interface Prop {
  children: React.ReactNode;
  fixedDir: FixedDir;
  distance: number;
}

const Dropdown = ({
  children,
  fixedDir,
  distance,
}: PropsWithChildren<Prop>) => {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div css={dropdownCss(theme, fixedDir, distance)} ref={ref}>
      {children}
    </div>
  );
};

export default Dropdown;

const dropdownCss = (theme: Theme, fixedDir: FixedDir, distance: number) => css`
  position: absolute;
  z-index: ${theme.zIndex.below(theme.zIndex.modal)};
  top: ${distance}px;
  ${fixedDir}: 0;

  display: flex;
  flex-direction: column;
  max-width: ${theme.maxWidths.mobile}px;
  width: 100%;
  border-radius: 10px;
`;

const Divider = () => {
  const theme = useTheme();

  return <div css={dividerCss(theme)} />;
};

Dropdown.Divider = Divider;

const dividerCss = (theme: Theme) => css`
  width: 100%;
  height: 1px;
  background-color: ${theme.colors.gray_100};
`;
