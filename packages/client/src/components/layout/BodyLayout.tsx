import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import type { PropsWithChildren } from 'react';

const BodyLayout = ({ children }: PropsWithChildren) => {
  return <div css={containerCss}>{children}</div>;
};

export default BodyLayout;

const containerCss = (theme: Theme) => css`
  width: 100%;
  max-width: ${theme.maxWidths.mobile};
  height: calc(100% - 80px - 80px);
  margin: 80px auto 80px;
`;
