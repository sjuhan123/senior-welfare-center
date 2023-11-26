import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useQuery } from "react-query";
import ClosestCenterList from "./CenterList";

type CurrentLocation = {
  latitude: number;
  longitude: number;
};

const getCurrentLocation: () => Promise<CurrentLocation> = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error.message);
          reject(error.message);
        }
      );
    } else {
      const errorMessage = "Geolocation is not supported by this browser.";
      console.error(errorMessage);
      reject(errorMessage);
    }
  });
};

const NearByCenterSection = () => {
  const { data: currentLocation, isLoading } = useQuery<CurrentLocation>(
    "currentLocation",
    getCurrentLocation
  );

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
      {isLoading && (
        <Flex
          align="center"
          justify="center"
          position="fixed"
          top="0"
          left="0"
          height="100%"
          width="100%"
        >
          <Spinner size="xl" color="blue.500" />
        </Flex>
      )}
      {currentLocation && <ClosestCenterList location={currentLocation} />}
    </Box>
  );
};

export default NearByCenterSection;
