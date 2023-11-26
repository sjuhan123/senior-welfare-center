import {
  Box,
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
  useDisclosure,
} from "@chakra-ui/react";
import NavButton from "../common/Button/NavButton";
import { useState } from "react";
import QualificationCheckCard from "../common/Card/QualificationCheckCard";

const QualificationSection = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isSeoulResident, setIsSeoulResident] = useState("");
  const [isAbove60, setIsAbove60] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleQualificationCheck = () => {
    if (isSeoulResident === "yes" && isAbove60 === "yes") {
      setIsChecked(true);
      onClose();
    }
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>노인복지관 자격확인하기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <FormControl mb="4">
                <FormLabel htmlFor="seoulResident">
                  <Text fontSize="md" fontWeight="bold">
                    1. 서울시 거주민이신가요?
                  </Text>
                </FormLabel>
                <RadioGroup
                  onChange={(value) => setIsSeoulResident(value)}
                  value={isSeoulResident}
                >
                  <HStack spacing="24px">
                    <Radio id="seoulResidentYes" value="yes">
                      네
                    </Radio>
                    <Radio id="seoulResidentNo" value="no">
                      아니요
                    </Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <FormControl mb="4">
                <FormLabel htmlFor="above60">
                  <Text fontSize="md" fontWeight="bold">
                    2. 만 60세 이상이신가요?
                  </Text>
                </FormLabel>
                <RadioGroup
                  onChange={(value) => setIsAbove60(value)}
                  value={isAbove60}
                >
                  <HStack spacing="24px">
                    <Radio id="above60Yes" value="yes">
                      네
                    </Radio>
                    <Radio id="above60No" value="no">
                      아니요
                    </Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            </Box>
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
