import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import { CURRENT_VIEW } from '../constant';
import CityFilterButton, { CityFilterButtonContent } from './CityFilterButton';
import AddressFilterButton, {
  AddressFilterButtonContent,
} from './AddressFilterButton';
import NearByFilterButton, {
  NearByFilterButtonContent,
} from './NearByFilterButton';
import type { Location } from '../../../types/location';
import { FaAngleDown } from 'react-icons/fa';
import { Dropdown, useDisclosure } from '@common/shared';

interface Props {
  currentFilter: string;
  onCitySet: (city: string) => void;
  onAddressSet: (location: Location) => void;
  onAddressNearBySet: (location: Location) => void;
}

const FilterDropdown = ({
  currentFilter,
  onCitySet,
  onAddressSet,
  onAddressNearBySet,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isLocationView = currentFilter === CURRENT_VIEW.LOCATION;
  const isAddressView = currentFilter === CURRENT_VIEW.ADDRESS;
  const isNearByView = currentFilter === CURRENT_VIEW.NEARBY;

  const onCityFilterSet = () => {
    onCitySet('서울시');
    onClose();
  };

  const onAddressFilterSet = (address: Location) => {
    onAddressSet(address);
    onClose();
  };

  const onAddressNearByFilterSet = (location: Location) => {
    onAddressNearBySet(location);
    onClose();
  };

  return (
    <Dropdown isOpen={isOpen} onClose={onClose}>
      <Dropdown.Toggle css={dropdownButtonCss} onClick={onOpen}>
        {isLocationView && (
          <CityFilterButtonContent isActive={isLocationView} />
        )}
        {isAddressView && (
          <AddressFilterButtonContent isActive={isAddressView} />
        )}
        {isNearByView && <NearByFilterButtonContent isActive={isNearByView} />}
        <FaAngleDown css={buttonIcon} />
      </Dropdown.Toggle>
      <Dropdown.Menu
        fixedDir="left"
        distance={60}
        isOpen={isOpen}
        onClose={onClose}
      >
        <div css={dropdownBodyCss}>
          <CityFilterButton
            isActive={isLocationView}
            onCitySet={onCityFilterSet}
          />
          <Dropdown.Divider />
          <AddressFilterButton
            isActive={isAddressView}
            onAddressSet={onAddressFilterSet}
          />
          <Dropdown.Divider />
          <NearByFilterButton
            isActive={isNearByView}
            onAddressNearBySet={onAddressNearByFilterSet}
          />
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FilterDropdown;

const dropdownButtonCss = (theme: Theme) => css`
  cursor: pointer;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
  padding: 10px 20px;
  border: 1px solid ${theme.colors.gray_100};
  border-radius: 5px;
`;

const buttonIcon = css`
  position: absolute;
  right: 8px;
`;

const dropdownBodyCss = (theme: Theme) => css`
  cursor: pointer;

  display: flex;
  top: 15px;
  flex-direction: column;
  align-items: center;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray_100};
  border-radius: 5px;
`;
