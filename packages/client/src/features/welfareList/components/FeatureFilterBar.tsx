import { css } from '@emotion/react';
import AddressFilterButton from './AddressFilterButton';
import LocationFilterButton from './LocationFilterButton';
import NearByFilterButton from './NearByFilterButton';
import type { Theme } from '@emotion/react';

const FeatureFilterBar = () => {
  return (
    <div css={containerCss}>
      <LocationFilterButton />
      <AddressFilterButton />
      <NearByFilterButton />
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
