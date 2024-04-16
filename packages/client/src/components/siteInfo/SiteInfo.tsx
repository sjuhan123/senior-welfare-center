import { Button } from '@common/shared';
import { css, type Theme } from '@emotion/react';

const SiteInfo = () => {
  return (
    <div css={containerCss}>
      <div css={infoCss}>
        <span
          css={css`
            font-weight: bold;
            padding-bottom: 5px;
          `}
        >
          2024 노인복지관
        </span>
        <span>
          본 사이트의 복지관 정보는 서울특별시 공식 홈페이지 데이터를 기반으로
          제작 되었습니다.
        </span>
      </div>
      <div css={OwnerCss}>
        <span>한승주.</span>
        <Button
          onClick={() => window.open('https://den-eight.vercel.app')}
          css={buttonCss}
        >
          블로그
        </Button>
        <Button
          onClick={() => window.open('mailto:sjuhan123@gmail.com ')}
          css={buttonCss}
        >
          이메일
        </Button>
      </div>
    </div>
  );
};

export default SiteInfo;

const containerCss = (theme: Theme) => css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: ${theme.maxWidths.mobile}px;
  height: 100%;
  background-color: ${theme.colors.gray_100};
  padding: 23px;
  font-size: 10px;
`;

const infoCss = css`
  display: flex;
  flex-direction: column;
`;

const OwnerCss = css`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const buttonCss = css`
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
