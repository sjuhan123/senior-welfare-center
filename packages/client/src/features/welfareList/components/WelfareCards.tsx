import { css } from '@emotion/react';
import WelfareCard from '../../../components/card/WelfareCard';
import type { Theme } from '@emotion/react';
import useGetWelfaresLocation from '../../../hooks/api/welfare/useGetWelfaresByLocation';
import useGetWelfaresByDistrictId from '../../../hooks/api/welfare/useGetWelfaresByDistrictId';
import type { Location } from '../../../types/location';

interface Prop {
  onCardSet: () => void;
  location: Location | null;
  districtId: string | null;
}

const WelfareCards = ({ location, onCardSet, districtId }: Prop) => {
  const tempDistrictId = location !== null ? null : districtId;

  const { data: welfaresByocation } = useGetWelfaresLocation(location, {
    suspense: true,
    onSuccess: () => {
      console.log('onSuccess');
      onCardSet ? onCardSet() : null;
    },
  });

  const { data: welfaresByDistrictId } = useGetWelfaresByDistrictId(
    tempDistrictId,
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
  height: calc(100vh - 285px);
`;

const wrapperCss = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 40px 24px;
  max-height: 370px;
`;
