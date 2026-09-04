import { css, useTheme } from '@emotion/react';
import { Button, typos } from '@common/shared';
import type { Theme } from '@emotion/react';
import useGetDistricts from '../../../hooks/api/district/useGetDistricts';
import type { DistrictData } from '../../../types/district';

interface Prop {
  currentDistrict: string;
  onDistrictClick: (district: DistrictData) => void;
}

const Districts = ({ currentDistrict, onDistrictClick }: Prop) => {
  const theme = useTheme();

  const { data } = useGetDistricts({
    suspense: true,
  });

  const districtList = [...(data?.data ?? [])];

  return (
    <ul css={listCss}>
      {districtList.map((district: DistrictData) => {
        const isSelected = district.name === currentDistrict;

        return (
          <Button
            key={district._id}
            css={buttonCss(theme, isSelected)}
            onClick={() => onDistrictClick(district)}
          >
            {district.name}
          </Button>
        );
      })}
    </ul>
  );
};

export default Districts;

const listCss = (theme: Theme) => css`
  display: flex;
  gap: 20px;
  background-color: ${theme.colors.white};
`;

const buttonCss = (theme: Theme, isSelected: boolean) => css`
  ${isSelected ? typos.DETAIL_1_BOLD : typos.DETAIL_1_REGULAR};

  height: 50px;

  ${isSelected &&
  css`
    color: ${theme.colors.blue_200};
    border-bottom: 2px solid ${theme.colors.blue_200};
    transition: border-bottom 0.3s;
  `}

  ${!isSelected &&
  css`
    &:hover {
      color: ${theme.colors.blue_200};
      border-bottom: 2px solid ${theme.colors.blue_100};
      transition: border-bottom 0.3s;
    }
  `}
`;
