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
} from "@chakra-ui/react";
import NavButton from "../common/Button/NavButton";
import ClosestCenterList from "../NearByCenterSection/ClosestCenterList";
import { Suspense, useState } from "react";
import LoadingIndicator from "../common/LoadingIndicator";
import DaumPostcodeEmbed from "react-daum-postcode";

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
      }
    );

    const data: FetchCoordinatesResponse = await response.json();

    const { x, y } = data.documents[0]?.address || {};
    return { latitude: y, longitude: x };
  } catch (error) {
    console.error("좌표 가져오기 실패:", error);
    throw new Error("좌표 가져오기 실패");
  }
};

const LocalWelfareSection = () => {
  const [isPostCodeOn, setIsPostCodeOn] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [coordinate, setCoordinate] = useState({
    latitude: 0,
    longitude: 0,
  });

  const handleComplete = async (data: PostCodeResponse) => {
    const roadAddress = data.roadAddress;
    const coordinateRes = await fetchCoordinates(roadAddress);
    setCoordinate(coordinateRes);
    onOpen();
  };

  const postCodeStyle = {
    position: "fixed",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 100,
  };

  return (
    <>
      <NavButton
        fLine="집 근처"
        sLine="복지관 찾기"
        onClick={() => setIsPostCodeOn(true)}
      />
      {isPostCodeOn && (
        <DaumPostcodeEmbed
          style={postCodeStyle}
          onComplete={handleComplete}
          autoClose={true}
        />
      )}
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
              <ClosestCenterList location={coordinate} from="home" />
            </Suspense>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LocalWelfareSection;
