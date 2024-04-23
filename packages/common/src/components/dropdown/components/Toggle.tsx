import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import type { HTMLAttributes, PropsWithChildren } from 'react';
import { useDropdownContext } from '../contexts/DropdownContext';

export interface Props extends HTMLAttributes<HTMLButtonElement> {
  onClickHandler?: () => void;
}

const Toggle = ({
  children,
  onClickHandler,
  ...props
}: PropsWithChildren<Props>) => {
  const { toggleDropdown } = useDropdownContext();

  const handleClick = () => {
    toggleDropdown();
    onClickHandler?.();
  };

  return (
    <button css={toggleCss} onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

export default Toggle;

const toggleCss = (theme: Theme) => css`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
  padding: 10px 20px;
  border: 1px solid ${theme.colors.gray_100};
  border-radius: 5px;
`;
