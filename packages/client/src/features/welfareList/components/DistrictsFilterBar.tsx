import Districts from './Districts';
import SlideBar from '../../../components/slideBar/SlideBar';
import type { Theme } from '@emotion/react';
import type { DistrictData } from '../../../types/district';
import { css } from '@emotion/react';
import { Suspense } from 'react';
import DistrictsSkeleton from './DistrictsSkeleton';

interface Prop {
  currentDistrict: string;
  onDistrictClick: (district: DistrictData) => void;
}

const DistrictFilterBar = ({ currentDistrict, onDistrictClick }: Prop) => {
  return (
    <section css={containerCss}>
      <SlideBar>
        <Suspense fallback={<DistrictsSkeleton />}>
          <Districts
            currentDistrict={currentDistrict}
            onDistrictClick={onDistrictClick}
          />
        </Suspense>
      </SlideBar>
    </section>
  );
};

export default DistrictFilterBar;

const containerCss = (theme: Theme) => css`
  position: relative;
  width: 100%;
  padding: 10px 0 0 0;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 2px;
    border-bottom: 1px solid ${theme.colors.gray_200};
    box-shadow: 0 2px 4px ${theme.colors.gray_100};
    z-index: 1;
  }
`;
