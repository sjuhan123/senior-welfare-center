import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
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
import { Dropdown } from '@common/shared';

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
  const ref = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isLocationView = currentFilter === CURRENT_VIEW.LOCATION;
  const isAddressView = currentFilter === CURRENT_VIEW.ADDRESS;
  const isNearByView = currentFilter === CURRENT_VIEW.NEARBY;

  const handleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const onCityFilter = (city: string) => {
    onCitySet(city);
    handleDropdown();
  };

  const onAddressFilter = (location: Location) => {
    onAddressSet(location);
    handleDropdown();
  };

  const onNearByFilter = (location: Location) => {
    onAddressNearBySet(location);
    handleDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div css={containerCss} ref={ref}>
      <button css={dropdownButtonCss} onClick={handleDropdown}>
        {isLocationView && (
          <CityFilterButtonContent isActive={isLocationView} />
        )}
        {isAddressView && (
          <AddressFilterButtonContent isActive={isAddressView} />
        )}
        {isNearByView && <NearByFilterButtonContent isActive={isNearByView} />}
        <FaAngleDown css={buttonIcon} />
      </button>
      {isDropdownOpen && (
        <Dropdown fixedDir="left" distance={60}>
          <div css={dropdownBodyCss}>
            <CityFilterButton
              isActive={isLocationView}
              onCitySet={onCityFilter}
            />
            <Dropdown.Divider />
            <AddressFilterButton
              isActive={isAddressView}
              onAddressSet={onAddressFilter}
            />
            <Dropdown.Divider />
            <NearByFilterButton
              isActive={isNearByView}
              onAddressNearBySet={onNearByFilter}
            />
          </div>
        </Dropdown>
      )}
    </div>
  );
};

export default FilterDropdown;

const containerCss = css`
  display: flex;
  position: relative;
  width: 100%;
`;

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
