import { EllipseButton, typos } from '@common/shared';
import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import { useState } from 'react';

const LocationFilterButton = () => {
  const [city] = useState('서울시');

  return (
    <EllipseButton>
      <div css={wrapperCss}>
        <span css={typos.DETAIL_1_REGULAR}>지역</span>
        <span css={[cityCss, typos.DETAIL_1_BOLD]}>{city}</span>
      </div>
    </EllipseButton>
  );
};

export default LocationFilterButton;

const wrapperCss = css`
  display: flex;
  gap: 10px;
`;

const cityCss = (theme: Theme) => css`
  color: ${theme.colors.blue_200};
`;
