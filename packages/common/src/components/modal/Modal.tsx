import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import type { PropsWithChildren } from 'react';

interface Props {
  onClickOutside: () => void;
  isBlurOn: boolean;
}

const Modal = ({
  children,
  onClickOutside,
  isBlurOn,
}: PropsWithChildren<Props>) => {
  return (
    <div css={dialogCss}>
      {isBlurOn && <div css={blurCss} onClick={onClickOutside} />}
      <div css={containerCss}>{children}</div>
    </div>
  );
};

export default Modal;

const dialogCss = css`
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100vh;
`;

const containerCss = (theme: Theme) => css`
  position: fixed;
  z-index: ${theme.zIndex.modal};
  display: flex;
  flex-direction: column;
  max-width: ${theme.maxWidths.mobile};

  border-radius: 10px;
`;

const blurCss = (theme: Theme) => css`
  position: fixed;
  z-index: ${theme.zIndex.below(theme.zIndex.modal)};
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.gray_200};
  opacity: 0.5;
`;
