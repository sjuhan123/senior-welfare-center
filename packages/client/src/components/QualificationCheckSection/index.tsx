import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import NavButton from "../common/Button/NavButton";
import { useState } from "react";
import QualificationCheckCard from "../common/Card/QualificationCheckCard";

const QualificationSection = () => {
  const toast = useToast();
  const [isChecked, setIsChecked] = useState(false);
  const [isSeoulResident, setIsSeoulResident] = useState("");
  const [isAbove60, setIsAbove60] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleQualificationCheck = () => {
    if (isSeoulResident === "yes" && isAbove60 === "yes") {
      setIsChecked(true);
      onClose();
      return;
    }
    toast({
      title: `노인 복지관 이용 자격이 없습니다.`,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <>
      {isChecked ? (
        <QualificationCheckCard
          onClick={() => {
            setIsChecked(false);
            onOpen();
          }}
        />
      ) : (
        <NavButton fLine="참여 자격" sLine="확인하기" onClick={onOpen} />
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>노인복지관 자격확인하기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="24px" mt="10">
              <FormControl mb="4">
                <VStack spacing="24px" align="flex-start">
                  <FormLabel htmlFor="seoulResident">
                    <Text fontSize="lg" fontWeight="bold">
                      1. 서울시 거주민이신가요?
                    </Text>
                  </FormLabel>
                  <RadioGroup
                    onChange={(value) => setIsSeoulResident(value)}
                    value={isSeoulResident}
                  >
                    <HStack spacing="24px">
                      <Radio id="seoulResidentYes" value="yes">
                        <Text fontSize="lg" fontWeight="bold">
                          네
                        </Text>
                      </Radio>
                      <Radio id="seoulResidentNo" value="no">
                        <Text fontSize="lg" fontWeight="bold">
                          아니요
                        </Text>
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </VStack>
              </FormControl>
              <FormControl mb="4">
                <VStack spacing="24px" align="flex-start">
                  <FormLabel htmlFor="above60">
                    <Text fontSize="lg" fontWeight="bold">
                      2. 만 60세 이상이신가요?
                    </Text>
                  </FormLabel>
                  <RadioGroup
                    onChange={(value) => setIsAbove60(value)}
                    value={isAbove60}
                  >
                    <HStack spacing="24px">
                      <Radio id="above60Yes" value="yes">
                        <Text fontSize="lg" fontWeight="bold">
                          네
                        </Text>
                      </Radio>
                      <Radio id="above60No" value="no">
                        <Text fontSize="lg" fontWeight="bold">
                          아니요
                        </Text>
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </VStack>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleQualificationCheck}
            >
              자격 확인하기
            </Button>
            <Button variant="ghost" onClick={onClose}>
              뒤로가기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default QualificationSection;
