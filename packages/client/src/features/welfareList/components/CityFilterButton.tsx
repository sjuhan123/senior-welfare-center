import { EllipseButton, typos } from '@common/shared';
import type { Theme } from '@emotion/react';
import { css, useTheme } from '@emotion/react';
import { useState } from 'react';

interface Props {
  isActive: boolean;
  onCitySet: (city: string) => void;
}

const CityFilterButton = ({ isActive, onCitySet }: Props) => {
  const theme = useTheme();

  // TODO: City API 완성시 로직 구현
  const [city] = useState('서울시');

  const handleButtonClick = () => {
    onCitySet ? onCitySet(city) : null;
  };

  return (
    <EllipseButton onClick={handleButtonClick}>
      <div css={wrapperCss}>
        <span css={typos.DETAIL_1_REGULAR}>지역</span>
        <span css={[cityCss(theme, isActive), typos.DETAIL_1_BOLD]}>
          {city}
        </span>
      </div>
    </EllipseButton>
  );
};

export default CityFilterButton;

const wrapperCss = css`
  display: flex;
  gap: 10px;
`;

const cityCss = (theme: Theme, isActive: boolean) => css`
  display: ${isActive ? 'block' : 'none'};
  color: ${theme.colors.blue_200};
`;
