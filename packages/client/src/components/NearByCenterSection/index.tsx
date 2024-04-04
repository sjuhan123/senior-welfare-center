import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import WelfaresNear from './WelfaresNear';
import LoadingIndicator from '../common/LoadingIndicator';
import NavButton from '../common/Button/NavButton';
import { Suspense } from 'react';
import { QUERY_KEYS } from '../../constant/queryKeys';

type CurrentLocation = {
  latitude: number;
  longitude: number;
};

const getCurrentLocation: () => Promise<CurrentLocation> = () => {
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

const NearByCenterSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    data: currentLocation,
    isLoading,
    error,
  } = useQuery<CurrentLocation, Error>(
    QUERY_KEYS.CURRENT_LOCATION,
    getCurrentLocation,
  );

  return (
    <>
      <NavButton fLine="내 근처" sLine="복지관 찾기" onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>가까운 노인복지관 목록</ModalHeader>
          <ModalBody>
            {isLoading && (
              <LoadingIndicator
                fLine="가까운 복지관을 찾는 중입니다"
                sLine="잠시만 기다려주세요."
              />
            )}
            {error && (
              <Flex
                justify="center"
                flexDir="column"
                align="flex-start"
                height="100%"
                width="100%"
              >
                <VStack>
                  <Text fontSize="lg" fontWeight="bold">
                    브라우저 설정에서 위치 정보를 허용해주세요.
                  </Text>
                  <Text fontSize="md" mt="2">
                    위치 정보를 허용하지 않으면 가까운 복지관을 찾을 수
                    없습니다.
                  </Text>
                </VStack>
              </Flex>
            )}
            {currentLocation && (
              <Suspense
                fallback={
                  <LoadingIndicator
                    fLine="가까운 복지관을 불러오고 있습니다."
                    sLine="잠시만 기다려주세요."
                  />
                }
              >
                <WelfaresNear location={currentLocation} />
              </Suspense>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NearByCenterSection;
