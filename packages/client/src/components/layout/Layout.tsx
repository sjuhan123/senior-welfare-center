import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div css={containerCss}>
      <div css={wrapperCss}>{children}</div>
    </div>
  );
};

export default Layout;

const containerCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const wrapperCss = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  max-width: ${theme.size.maxWidth};
`;
