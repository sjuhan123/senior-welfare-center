import { EllipseButton, typos } from '@common/shared';
import { css } from '@emotion/react';

const AddressFilterButton = () => {
  return (
    <EllipseButton>
      <div css={wrapperCss}>
        <span css={typos.DETAIL_1_REGULAR}>집 인근 복지관 찾기</span>
      </div>
    </EllipseButton>
  );
};

export default AddressFilterButton;

const wrapperCss = css`
  display: flex;
  gap: 10px;
`;
