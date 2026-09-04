import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';

interface Props {
  districtTotal?: number;
}

const DistrictsSkeleton = ({ districtTotal = 30 }: Props) => {
  return (
    <ul css={listCss}>
      {Array.from({ length: districtTotal }, (_, index) => (
        <div key={index} css={buttonCss}>
          <div css={buttonInnerCss} />
        </div>
      ))}
    </ul>
  );
};

export default DistrictsSkeleton;

const listCss = (theme: Theme) => css`
  display: flex;
  gap: 20px;
  background-color: ${theme.colors.white};
`;

const buttonCss = css`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 50px;
  width: 50px;
`;

const buttonInnerCss = (theme: Theme) => css`
  height: 25px;
  width: 50px;

  background-color: ${theme.colors.gray_100};
  border-radius: 10px;
  animation: ${theme.animations.pulse} 1.5s infinite;
`;
