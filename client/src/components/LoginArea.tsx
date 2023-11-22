import LoginButton from "./common/Button/LoginButton";
import EmployeeLoginButton from "./common/Button/EmployeeLoginButton";
import { Box, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { RiAccountPinCircleFill } from "react-icons/ri";
import WelfareBookMarkCard from "./common/Card/WelfareBookMarkCard";
import BookmarkableCard from "./common/Card/BookmarkableCard";
import ToButton from "./common/Button/ToButton";
import { KakaoLogo } from "../assets";

const mockData = [
  {
    _id: 1,
    district: {
      _id: 1,
      name: "마포구",
    },
    name: "우리마포복지관",
    address: "신촌로26길10",
    phone: "02-358-1000",
    remarks: "",
  },
];

const LoginArea = () => {
  const [isLogined, setIsLogined] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [welfareCenter, setWelfareCenter] = useState(mockData);

  return (
    <Box as="div">
      <Box
        as="div"
        display="flex"
        flexDir="row"
        gap={2}
        alignItems="center"
        p="0px 0px 10px 0px"
        align-items="flex-end"
      >
        {isLogined ? (
          <ToButton
            leftIcon={<KakaoLogo />}
            onClick={() => setIsLogined(false)}
            bg="#FEE500"
            text="로그아웃"
          />
        ) : (
          <Icon as={RiAccountPinCircleFill} w={6} h={6} />
        )}
      </Box>
      <Box as="section" display="flex" flexDir="column" gap={4}>
        {!isLogined ? (
          <>
            <EmployeeLoginButton />
            <LoginButton onLogin={() => setIsLogined(!isLogined)} />
          </>
        ) : welfareCenter.length === 0 ? (
          <>
            <BookmarkableCard />
            <BookmarkableCard />
          </>
        ) : (
          <>
            {welfareCenter.map((center) => (
              <WelfareBookMarkCard
                key={center._id}
                center={center}
                onDelete={() => {}}
              />
            ))}
            {welfareCenter.length === 1 && <BookmarkableCard />}
          </>
        )}
      </Box>
    </Box>
  );
};

export default LoginArea;
