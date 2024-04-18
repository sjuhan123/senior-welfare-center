import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import type { PropsWithChildren } from 'react';
import Portal from '../portal/Portal';

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
    <Portal>
      <div css={dialogCss} onClick={onClickOutside}>
        {isBlurOn && <div css={blurCss} onClick={onClickOutside} />}
        <div css={containerCss}>{children}</div>
      </div>
    </Portal>
  );
};

export default Modal;

const dialogCss = (theme: Theme) => css`
  position: absolute;
  z-index: ${theme.zIndex.modal};
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
  z-index: ${theme.zIndex.above(theme.zIndex.modal)};
  display: flex;
  flex-direction: column;
  max-width: ${theme.maxWidths.mobile}px;

  border-radius: 10px;
`;

const blurCss = (theme: Theme) => css`
  position: fixed;
  z-index: ${theme.zIndex.below(theme.zIndex.modal)};
  width: 100%;
  height: 100vh;
  background-color: ${theme.colors.gray_200};
  opacity: 0.5;
`;
