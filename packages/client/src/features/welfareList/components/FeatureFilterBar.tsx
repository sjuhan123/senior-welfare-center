import { css } from '@emotion/react';
import AddressFilterButton from './AddressFilterButton';
import NearByFilterButton from './NearByFilterButton';
import type { Theme } from '@emotion/react';
import type { Location } from '../../../types/location';
import { CURRENT_VIEW } from '../constant';
import CityFilterButton from './CityFilterButton';

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
  return (
    <div css={containerCss}>
      <CityFilterButton
        onCitySet={onCitySet}
        isActive={currentFilter === CURRENT_VIEW.LOCATION}
      />
      <AddressFilterButton
        isActive={currentFilter === CURRENT_VIEW.ADDRESS}
        onAddressSet={onAddressSet}
      />
      <NearByFilterButton
        onAddressNearBySet={onAddressNearBySet}
        isActive={currentFilter === CURRENT_VIEW.NEARBY}
      />
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
