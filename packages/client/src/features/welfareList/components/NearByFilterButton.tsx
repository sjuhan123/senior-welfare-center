import { EllipseButton, typos } from '@common/shared';
import type { Theme } from '@emotion/react';
import { css, useTheme } from '@emotion/react';

interface Prop {
  isActive: boolean;
}

const NearByFilterButton = ({ isActive }: Prop) => {
  const theme = useTheme();

  return (
    <EllipseButton>
      <div css={wrapperCss(theme, isActive)}>
        <span css={typos.DETAIL_1_REGULAR}>가까운 복지관 찾기</span>
      </div>
    </EllipseButton>
  );
};

export default NearByFilterButton;

const wrapperCss = (theme: Theme, isActive: boolean) => css`
  display: flex;
  gap: 10px;

  color: ${isActive ? theme.colors.blue_200 : theme.colors.black};
`;
