// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import NavButton from '../common/Button/NavButton';
import WelfaresNear from '../NearByCenterSection/WelfaresNear';
import { Suspense, useState } from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import DaumPostcodeEmbed from 'react-daum-postcode';

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

    const data: FetchCoordinatesResponse = await response.json();

    const { x, y } = data.documents[0]?.address || {};
    return { latitude: y, longitude: x };
  } catch (error) {
    console.error('좌표 가져오기 실패:', error);
    throw new Error('좌표 가져오기 실패');
  }
};

const LocalWelfareSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [coordinate, setCoordinate] = useState({
    latitude: 0,
    longitude: 0,
  });
  const isCoordinateSet =
    coordinate.latitude !== 0 && coordinate.longitude !== 0;

  const handleComplete = async (data: PostCodeResponse) => {
    const roadAddress = data.roadAddress;
    const coordinateRes = await fetchCoordinates(roadAddress);
    setCoordinate(coordinateRes);
  };

  const handleReset = () => {
    setCoordinate({ latitude: 0, longitude: 0 });
  };

  return (
    <>
      <NavButton fLine="집 근처" sLine="복지관 찾기" onClick={onOpen} />
      {!isCoordinateSet && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <DaumPostcodeEmbed
              key="postcode"
              onComplete={handleComplete}
              style={{
                padding: '5px 0 0 0',
                height: '100%',
              }}
            />
          </ModalContent>
        </Modal>
      )}
      {isCoordinateSet && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>집 근처 복지관 목록</ModalHeader>
            <ModalBody>
              <Suspense
                fallback={
                  <LoadingIndicator
                    fLine="가까운 복지관을 불러오고 있습니다."
                    sLine="잠시만 기다려주세요."
                  />
                }
              >
                <WelfaresNear location={coordinate} from="home" />
              </Suspense>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleReset}>
                주소 검색 다시하기
              </Button>
              <Button variant="ghost" mr={3} onClick={onClose}>
                닫기
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default LocalWelfareSection;
