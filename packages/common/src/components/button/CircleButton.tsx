import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import { type HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

const CircleButton = ({ children, disabled, ...props }: Props) => {
  return (
    <button {...props} disabled={disabled} css={buttonCss}>
      {children}
    </button>
  );
};

export default CircleButton;

const buttonCss = (theme: Theme) => css`
  all: unset;

  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 30px;
  width: 30px;

  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray_200};
  border-radius: 50%;

  &:hover {
    background-color: ${theme.colors.gray_100};
  }
`;
