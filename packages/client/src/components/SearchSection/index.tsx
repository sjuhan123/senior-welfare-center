import {
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Suspense, useState } from "react";

import WelfaresInDistrict from "./WelfaresInDistrict";
import BreadscrumbList from "./BreadscrumbList";
import DistrictList from "./Districts";
import NavButton from "../common/Button/NavButton";
import LoadingIndicator from "../common/LoadingIndicator";

const SearchSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [breadCrumbList, setBreadCrumbList] = useState<string[]>(["서울시"]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(
    null
  );

  const handleBreadCrumbClick = () => {
    setBreadCrumbList(["서울시"]);
    setSelectedDistrictId(null);
  };

  const handleDistrictClick = (districtName: string, districtId: string) => {
    setBreadCrumbList([...breadCrumbList, districtName]);
    setSelectedDistrictId(districtId);
  };

  const handleClose = () => {
    setBreadCrumbList(["서울시"]);
    setSelectedDistrictId(null);
    onClose();
  };

  return (
    <>
      <NavButton fLine="복지관" sLine="목록 보기" onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>노인복지관 목록보기</ModalHeader>
          <ModalCloseButton />
          <Stack direction="row" h="8" align="center" mb="3" gap="5" ml="6">
            <Divider orientation="vertical" />
            <BreadscrumbList
              breadCrumbList={breadCrumbList}
              onBreadCrumbClick={handleBreadCrumbClick}
            />
          </Stack>
          <ModalBody>
            <Box>
              {!selectedDistrictId && (
                <Suspense
                  fallback={
                    <LoadingIndicator
                      fLine="지역 정보를 불러오는 중입니다"
                      sLine="잠시만 기다려주세요."
                    />
                  }
                >
                  <DistrictList onDistrictClick={handleDistrictClick} />
                </Suspense>
              )}
              {selectedDistrictId && (
                <Suspense
                  fallback={
                    <LoadingIndicator
                      fLine="복지관 정보를 불러오는 중 입니다."
                      sLine="잠시만 기다려주세요."
                    />
                  }
                >
                  <WelfaresInDistrict districtId={selectedDistrictId} />
                </Suspense>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            {breadCrumbList.length > 1 && (
              <Button colorScheme="blue" mr={3} onClick={handleBreadCrumbClick}>
                지역 다시 찾기
              </Button>
            )}
            <Button variant="ghost" onClick={handleClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchSection;
