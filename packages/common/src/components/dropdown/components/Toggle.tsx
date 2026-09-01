import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import type { HTMLAttributes, PropsWithChildren } from 'react';

export interface Props extends HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
}

const Toggle = ({ children, onClick, ...props }: PropsWithChildren<Props>) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <button css={toggleCss} {...props} onClick={handleClick}>
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
