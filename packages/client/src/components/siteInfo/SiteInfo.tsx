import { css, type Theme } from '@emotion/react';

const SiteInfo = () => {
  return (
    <div css={containerCss}>
      <span
        css={css`
          font-weight: bold;
          padding-bottom: 5px;
        `}
      >
        2024 노인복지관
      </span>
      <span>이메일: sjuhan123@gmail.com</span>
      <span>블로그: https://den-eight.vercel.app/blog</span>
    </div>
  );
};

export default SiteInfo;

const containerCss = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-width: ${theme.maxWidths.mobile}px;
  height: 100%;
  background-color: ${theme.colors.gray_100};
  padding: 0 20px;
  font-size: 10px;
`;
