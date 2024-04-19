import { EllipseButton, typos } from '@common/shared';
import type { Theme } from '@emotion/react';
import { css, useTheme } from '@emotion/react';
import useBreakPointValue from '../../../hooks/breakPoint/useBreakPointValue';
import BREAKE_POINT from '../../../hooks/breakPoint/constant';

interface Props {
  city?: string;
  isActive: boolean;
  onCitySet?: (city: string) => void;
}

// TODO: City API 완성시 로직 구현
const CityFilterButton = ({ city = '서울시', isActive, onCitySet }: Props) => {
  const breakpointValue = useBreakPointValue();
  const isMobile = breakpointValue === BREAKE_POINT.MOBILE;

  const handleButtonClick = () => {
    if (isActive) return;
    onCitySet ? onCitySet(city) : null;
  };

  return (
    <>
      {isMobile && (
        <div css={containerCss} onClick={handleButtonClick}>
          <CityFilterButtonContent city={city} isActive={isActive} />
        </div>
      )}
      {!isMobile && (
        <EllipseButton onClick={handleButtonClick}>
          <CityFilterButtonContent city={city} isActive={isActive} />
        </EllipseButton>
      )}
    </>
  );
};

export default CityFilterButton;

const containerCss = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 50px;
  width: 100%;

  &:hover {
    background-color: ${theme.colors.gray_100};
  }
`;

export const CityFilterButtonContent = ({
  city = '서울시',
  isActive,
}: Pick<Props, 'city' | 'isActive'>) => {
  const theme = useTheme();

  return (
    <div css={wrapperCss}>
      <span css={typos.DETAIL_1_REGULAR}>지역</span>
      <span css={[cityCss(theme, isActive), typos.DETAIL_1_BOLD]}>{city}</span>
    </div>
  );
};

const wrapperCss = css`
  display: flex;
  gap: 10px;
`;

const cityCss = (theme: Theme, isActive: boolean) => css`
  display: ${isActive ? 'block' : 'none'};
  color: ${theme.colors.blue_200};
`;
