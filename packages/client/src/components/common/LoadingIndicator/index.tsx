import { Flex, Text } from '@chakra-ui/react';
import Dots from './Dots';

interface LoadingIndicatorProps {
  fLine: string;
  sLine?: string;
}

const LoadingIndicator = ({ fLine, sLine }: LoadingIndicatorProps) => {
  return (
    <Flex
      justify="center"
      flexDir="column"
      align="flex-start"
      height="100%"
      width="100%"
    >
      <Text fontSize="lg" fontWeight="bold">
        {fLine}
      </Text>
      <Flex>
        <Text fontSize="md" mt="2">
          {sLine}
        </Text>
        <Dots />
      </Flex>
    </Flex>
  );
};

export default LoadingIndicator;
