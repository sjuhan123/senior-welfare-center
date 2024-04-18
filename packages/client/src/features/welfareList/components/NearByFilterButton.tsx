// TODO: KaKao API 타입 학습 후 수정 필요
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { EllipseButton, typos } from '@common/shared';
import type { Theme } from '@emotion/react';
import { css, useTheme } from '@emotion/react';
import type { Location } from '../../../types/location';
import { useQuery } from 'react-query';
import { QUERY_KEYS } from '../../../constant/queryKeys';

const getCurrentCoordinate: () => Promise<Location> = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error: GeolocationPositionError) => {
          console.error('Error getting location:', error.message);
          reject(error.message);
        },
      );
    } else {
      const errorMessage = 'Geolocation is not supported by this browser.';
      console.error(errorMessage);
      reject(errorMessage);
    }
  });
};

const fetchAddress = async (latitude: string, longitude: string) => {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
      {
        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
        },
      },
    );

    const data = await response.json();

    const address = data.documents[0]?.address?.address_name || '';

    return address;
  } catch (error) {
    console.error('주소 가져오기 실패:', error);
    throw new Error('주소 가져오기 실패');
  }
};

interface Prop {
  isActive: boolean;
  onAddressNearBySet: (coordinate: Location) => void;
}

const NearByFilterButton = ({ isActive, onAddressNearBySet }: Prop) => {
  const theme = useTheme();

  const { data: currentCoordinate } = useQuery<Location, Error>(
    QUERY_KEYS.CURRENT_LOCATION,
    getCurrentCoordinate,
  );

  const handleButtonClick = async () => {
    if (!currentCoordinate) {
      return;
    }

    const { latitude, longitude } = currentCoordinate;
    const address = await fetchAddress(String(latitude), String(longitude));

    const addressInfo = {
      latitude,
      longitude,
      address,
    };

    onAddressNearBySet ? onAddressNearBySet(addressInfo) : null;
  };

  return (
    <EllipseButton onClick={handleButtonClick}>
      <div css={wrapperCss(theme, isActive)}>
        <span css={typos.DETAIL_1_REGULAR}>가까운 복지관 찾기</span>
      </div>
    </EllipseButton>
  );
};

export default NearByFilterButton;

const wrapperCss = (theme: Theme, isActive: boolean) => css`
  display: flex;
  gap: 10px;

  color: ${isActive ? theme.colors.blue_200 : theme.colors.black};
`;
