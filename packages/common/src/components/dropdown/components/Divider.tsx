import type { Theme } from '@emotion/react';
import { css, useTheme } from '@emotion/react';

const Divider = () => {
  const theme = useTheme();

  return <div css={dividerCss(theme)} />;
};

export default Divider;

const dividerCss = (theme: Theme) => css`
  width: 100%;
  height: 1px;
  background-color: ${theme.colors.gray_100};
`;
