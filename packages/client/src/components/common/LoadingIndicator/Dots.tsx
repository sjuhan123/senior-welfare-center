import { Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const Dots = () => {
  const [loadingDots, setLoadingDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots(prev => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Flex align="flex-end">
      <Text fontSize="md" fontWeight="bold">
        {Array(loadingDots + 1)
          .fill('.')
          .join('')}
      </Text>
    </Flex>
  );
};

export default Dots;
