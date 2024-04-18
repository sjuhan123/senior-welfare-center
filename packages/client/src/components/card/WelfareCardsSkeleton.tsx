import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';

interface Props {
  cardTotal?: number;
}

const WelfareCardsSkeleton = ({ cardTotal = 4 }: Props) => {
  return (
    <section css={containerCss}>
      <ul css={wrapperCss}>
        {Array.from({ length: cardTotal }, (_, index) => (
          <li key={index} css={cardContainerCss}>
            <div css={cardImageWrapperCss}>
              <div css={cardImageCss} />
            </div>
            <div css={cardBodyCss}>
              <div css={cardInfoCss}>
                <h2 />
                <span />
                <p />
                <p />
              </div>
              <div css={buttonCss} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WelfareCardsSkeleton;

const containerCss = (theme: Theme) => css`
  display: grid;
  overflow: auto;

  padding: 10px 20px;
  background-color: ${theme.colors.white};
  width: 100%;
  height: calc(100vh - 277px);
`;

const wrapperCss = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 40px 24px;
  padding: 10px 0;
`;

const cardContainerCss = css`
  display: flex;
  flex-direction: column;
`;

const cardImageWrapperCss = (theme: Theme) => css`
  height: 100%;
  width: 100%;
  background-color: ${theme.colors.gray_100};
  border-radius: 10px;
  animation: ${theme.animations.pulse} 2s infinite ease-in-out;
`;

const cardImageCss = css`
  height: 253px;
  width: 300px;
`;

const cardBodyCss = css`
  display: flex;
  position: relative;
  flex-direction: row;
  padding: 12px 0 0 0;
  width: 100%;
`;

const cardInfoCss = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  h2 {
    width: 170px;
    height: 20px;
    background-color: ${theme.colors.gray_100};
    border-radius: 10px;
    animation: ${theme.animations.pulse} 2s infinite ease-in-out;
  }

  span {
    width: 180px;
    height: 20px;
    background-color: ${theme.colors.gray_100};
    border-radius: 10px;
    animation: ${theme.animations.pulse} 2s infinite ease-in-out;
  }

  p {
    width: 150px;
    height: 20px;
    background-color: ${theme.colors.gray_100};
    border-radius: 10px;
    animation: ${theme.animations.pulse} 2s infinite ease-in-out;
  }
`;

const buttonCss = (theme: Theme) => css`
  display: flex;
  align-items: center;
  width: 60px;
  height: 20px;
  position: absolute;
  right: 0;
  border-radius: 10px;

  background-color: ${theme.colors.gray_100};
  animation: ${theme.animations.pulse} 2s infinite ease-in-out;
`;
