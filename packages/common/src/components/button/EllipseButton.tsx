import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import { type HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {}

const EllipseButton = ({ children, ...props }: Props) => {
  return (
    <button {...props} css={buttonCss}>
      {children}
    </button>
  );
};

export default EllipseButton;

const buttonCss = (theme: Theme) => css`
  all: unset;

  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 45px;

  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray_200};
  border-radius: 5px;
  padding: 0 14px;

  &:hover {
    background-color: ${theme.colors.gray_100};
  }
`;
