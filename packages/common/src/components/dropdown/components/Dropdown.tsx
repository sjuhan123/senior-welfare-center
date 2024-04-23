import { css } from '@emotion/react';
import { PropsWithChildren } from 'react';
import Toggle from './Toggle';
import Menu from './Menu';
import Divider from './Divider';
import { DropdownProvider } from '../contexts/DropdownContext';

const Dropdown = ({ children }: PropsWithChildren) => {
  return (
    <DropdownProvider>
      <div css={containerCss}>{children}</div>
    </DropdownProvider>
  );
};

export default Dropdown;

Dropdown.Toggle = Toggle;
Dropdown.Menu = Menu;
Dropdown.Divider = Divider;

const containerCss = css`
  display: flex;
  position: relative;
  width: 100%;
`;
