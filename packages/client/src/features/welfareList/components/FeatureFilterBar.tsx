import { css } from '@emotion/react';
import AddressFilterButton from './AddressFilterButton';
import NearByFilterButton from './NearByFilterButton';
import type { Theme } from '@emotion/react';
import type { Location } from '../../../types/location';
import { CURRENT_VIEW } from '../constant';
import CityFilterButton from './CityFilterButton';
import useBreakPointValue from '../../../hooks/breakPoint/useBreakPointValue';
import BREAKE_POINT from '../../../hooks/breakPoint/constant';
import FilterDropdown from './FilterDropdown';

interface Props {
  currentFilter: string;
  onCitySet: (city: string) => void;
  onAddressSet: (location: Location) => void;
  onAddressNearBySet: (location: Location) => void;
}

const FeatureFilterBar = ({
  currentFilter,
  onCitySet,
  onAddressSet,
  onAddressNearBySet,
}: Props) => {
  const breakpointValue = useBreakPointValue();

  const isMobile = breakpointValue === BREAKE_POINT.MOBILE;

  const isLocationView = currentFilter === CURRENT_VIEW.LOCATION;
  const isAddressView = currentFilter === CURRENT_VIEW.ADDRESS;
  const isNearByView = currentFilter === CURRENT_VIEW.NEARBY;

  return (
    <div css={containerCss}>
      {isMobile && (
        <FilterDropdown
          onCitySet={onCitySet}
          onAddressSet={onAddressSet}
          onAddressNearBySet={onAddressNearBySet}
          currentFilter={currentFilter}
        />
      )}
      {!isMobile && (
        <>
          <CityFilterButton onCitySet={onCitySet} isActive={isLocationView} />
          <AddressFilterButton
            isActive={isAddressView}
            onAddressSet={onAddressSet}
          />
          <NearByFilterButton
            onAddressNearBySet={onAddressNearBySet}
            isActive={isNearByView}
          />
        </>
      )}
    </div>
  );
};

export default FeatureFilterBar;

const containerCss = (theme: Theme) => css`
  display: flex;
  gap: 10px;
  padding: 10px 20px 0 20px;
  background-color: ${theme.colors.white};
  width: 100%;
`;
