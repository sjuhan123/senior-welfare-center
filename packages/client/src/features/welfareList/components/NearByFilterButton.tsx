import { EllipseButton, typos } from '@common/shared';
import { css } from '@emotion/react';

const NearByFilterButton = () => {
  return (
    <EllipseButton>
      <div css={wrapperCss}>
        <span css={typos.DETAIL_1_REGULAR}>가까운 복지관 찾기</span>
      </div>
    </EllipseButton>
  );
};

export default NearByFilterButton;

const wrapperCss = css`
  display: flex;
  gap: 10px;
`;
