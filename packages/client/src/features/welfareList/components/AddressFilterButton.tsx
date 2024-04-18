import { EllipseButton, Modal, typos } from '@common/shared';
import { css, useTheme } from '@emotion/react';
import type { Location } from '../../../types/location';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { useState } from 'react';
import type { Theme } from '@emotion/react';

interface FetchCoordinatesResponse {
  documents: {
    address: {
      x: number;
      y: number;
    };
  }[];
}

interface PostCodeResponse {
  roadAddress: string;
}

const fetchCoordinates = async (roadAddress: string) => {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${roadAddress}`,
      {
        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
        },
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: FetchCoordinatesResponse = await response.json();

    const { x, y } = data.documents[0]?.address || {};
    return { latitude: y, longitude: x };
  } catch (error) {
    console.error('좌표 가져오기 실패:', error);
    throw new Error('좌표 가져오기 실패');
  }
};

interface Prop {
  isActive: boolean;
  onAddressSet: (coordinate: Location) => void;
}

const AddressFilterButton = ({ isActive, onAddressSet }: Prop) => {
  const theme = useTheme();

  const [isCoordinateSet, setIsCoordinateSet] = useState(false);

  const handleButtonClick = () => {
    setIsCoordinateSet(prev => !prev);
  };

  const handleModalClose = () => {
    setIsCoordinateSet(false);
  };

  const handleComplete = async (data: PostCodeResponse) => {
    handleModalClose();

    const roadAddress = data.roadAddress;
    const coordinateRes = await fetchCoordinates(roadAddress);

    const { latitude, longitude } = coordinateRes;

    const addressInfo = {
      latitude,
      longitude,
      address: roadAddress,
    };

    onAddressSet ? onAddressSet(addressInfo) : null;
  };

  return (
    <>
      <EllipseButton onClick={handleButtonClick}>
        <div css={wrapperCss(theme, isActive)}>
          <span css={typos.DETAIL_1_REGULAR}>집 인근 복지관 찾기</span>
        </div>
      </EllipseButton>
      {isCoordinateSet && (
        <Modal onClickOutside={handleModalClose} isBlurOn={true}>
          <DaumPostcodeEmbed
            key="postcode"
            onComplete={handleComplete}
            style={{
              padding: '5px 0 0 0',
              height: '500px',
              maxHeight: '100vh',
              width: '100vw',
              maxWidth: '600px',
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default AddressFilterButton;

const wrapperCss = (theme: Theme, isActive: boolean) => css`
  display: flex;
  gap: 10px;

  color: ${isActive ? theme.colors.blue_200 : theme.colors.black};
`;
