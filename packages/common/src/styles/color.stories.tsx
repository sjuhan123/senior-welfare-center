import { css, ThemeProvider } from '@emotion/react';
import { type Meta } from '@storybook/react';

import theme from './theme';

export const Default = () => {
  return (
    <ThemeProvider theme={theme}>
      <div css={headingCss}>Text & Icon</div>
      <div css={FlexBoxCss}>
        <div
          css={[theme => ({ backgroundColor: theme.colors.black }), BoxCss]}
        />
        <div
          css={[theme => ({ backgroundColor: theme.colors.gray_300 }), BoxCss]}
        />
        <div
          css={[theme => ({ backgroundColor: theme.colors.gray_200 }), BoxCss]}
        />
        <div
          css={[theme => ({ backgroundColor: theme.colors.gray_100 }), BoxCss]}
        />
      </div>
      <div css={FlexBoxCss}>
        <span>$black</span>
        <span>$gray_300 (text-disabled)</span>
        <span>$gray_200 (text-subtitle)</span>
        <span>$gray_100</span>
      </div>
      <div css={headingCss}>Button</div>
      <div css={FlexBoxCss}>
        <div
          css={[theme => ({ backgroundColor: theme.colors.green_300 }), BoxCss]}
        />
        <div
          css={[theme => ({ backgroundColor: theme.colors.green_100 }), BoxCss]}
        />
        <div
          css={[theme => ({ backgroundColor: theme.colors.green_200 }), BoxCss]}
        />
      </div>
      <div css={FlexBoxCss}>
        <span>$green_300 (main-color)</span>
        <span>$green_100 (button-disabled)</span>
        <span>$green_200 (button-hover)</span>
      </div>
    </ThemeProvider>
  );
};

const headingCss = css`
  margin: 30px 0 10px;
  font-size: 30px;
  font-weight: 700;
  color: #2c433c;
`;

const FlexBoxCss = css`
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  margin-top: 10px;

  & > span {
    width: 100px;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
  }
`;

const BoxCss = css`
  width: 100px;
  height: 100px;
  border: 2px solid rgb(10 10 12 / 8%);
  border-radius: 15.2085px;
`;

const meta: Meta<typeof Default> = {
  title: 'Colors',
  component: Default,
};

export default meta;
