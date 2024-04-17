import { css } from '@emotion/react';
import WelfareCard from '../../../components/card/WelfareCard';
import type { Theme } from '@emotion/react';
import useGetWelfaresLocation from '../../../hooks/api/welfare/useGetWelfaresByLocation';
import useGetWelfaresByDistrictId from '../../../hooks/api/welfare/useGetWelfaresByDistrictId';
import type { Location } from '../../../types/location';

interface Prop {
  location: Location | null;
  districtId: string | null;
}

const WelfareCards = ({ location, districtId }: Prop) => {
  const { data: welfaresByocation } = useGetWelfaresLocation(location, {
    suspense: true,
  });

  const { data: welfaresByDistrictId } = useGetWelfaresByDistrictId(
    districtId,
    {
      suspense: true,
    },
  );

  const welfareCards = [
    ...(welfaresByocation?.data ?? welfaresByDistrictId?.data ?? []),
  ];

  return (
    <div css={containerCss}>
      <div css={wrapperCss}>
        {welfareCards.map(welfareInfo => (
          <WelfareCard key={welfareInfo._id} welfareInfo={welfareInfo} />
        ))}
      </div>
    </div>
  );
};

export default WelfareCards;

const containerCss = (theme: Theme) => css`
  display: grid;
  overflow: auto;

  padding: 20px;
  background-color: ${theme.colors.white};
  width: 100%;
  height: calc(100vh - 277px);
`;

const wrapperCss = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 40px 24px;
  max-height: 370px;
`;
