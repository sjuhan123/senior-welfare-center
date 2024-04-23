import { css } from '@emotion/react';
import { PropsWithChildren, useRef } from 'react';
import Toggle from './Toggle';
import Menu from './Menu';
import Divider from './Divider';
import useClickOutside from '../../../hooks/interaction/useClickOutside';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Dropdown = ({ children, isOpen, onClose }: PropsWithChildren<Props>) => {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => {
    if (isOpen) {
      onClose();
    }
  });

  return (
    <div css={containerCss} ref={ref}>
      {children}
    </div>
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
