import { css } from '@emotion/react';
import type { PropsWithChildren } from 'react';

const Footer = ({ children }: PropsWithChildren) => {
  return <footer css={containerCss}>{children}</footer>;
};

export default Footer;

const containerCss = css`
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 80px;
`;
