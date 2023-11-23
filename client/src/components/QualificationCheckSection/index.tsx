import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  HStack,
  Flex,
  Text,
} from "@chakra-ui/react";

interface QualificationCheckerProps {
  onQualificationCheck: (isChecked: boolean) => void;
  onCancel: () => void;
}

const QualificationCheckSection = ({
  onQualificationCheck,
  onCancel,
}: QualificationCheckerProps) => {
  const [isSeoulResident, setIsSeoulResident] = useState("");
  const [isAbove60, setIsAbove60] = useState("");

  const handleQualificationCheck = () => {
    if (isSeoulResident === "yes" && isAbove60 === "yes") {
      onQualificationCheck(true);
      onCancel();
    }
  };

  return (
    <Box
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      p="5"
      h="208px"
    >
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
        <RadioGroup onChange={(value) => setIsAbove60(value)} value={isAbove60}>
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
      <Flex justify="flex-end">
        <Button
          colorScheme="blue"
          onClick={handleQualificationCheck}
          mr="2"
          size="sm"
        >
          자격 확인하기
        </Button>
        <Button onClick={onCancel} colorScheme="gray" size="sm">
          뒤로가기
        </Button>
      </Flex>
    </Box>
  );
};

export default QualificationCheckSection;
