import ToButton from "../common/Button/ToButton";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { KakaoLogo } from "../../assets";
import { useAtomValue } from "jotai";
import { userInfoAtom } from "../../store/user";

interface TabBarProps {
  onLogout: () => void;
}

const AccountBar = ({ onLogout }: TabBarProps) => {
  const userInfo = useAtomValue(userInfoAtom);
  const { userName, userAvatar } = userInfo;

  return (
    <Flex w="100%" p="0px 10px" gap={2} justifyContent="space-between">
      <Box display="flex" flexDir="row" gap={2} alignItems="flex-end">
        <Avatar size="xs" name={userName} src={userAvatar} />
        <Text fontSize="sm" fontWeight="bold">
          {userName}
        </Text>
        <Text fontSize="sm">님</Text>
      </Box>
      <ToButton
        leftIcon={<KakaoLogo />}
        onClick={onLogout}
        bg="#FEE500"
        text="로그아웃"
      />
    </Flex>
  );
};

export default AccountBar;
