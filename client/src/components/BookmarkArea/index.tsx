import LoginButton from "../common/Button/LoginButton";
import EmployeeLoginButton from "../common/Button/EmployeeLoginButton";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

import BookmarkButton from "../common/Button/BookmarkButton";
import AccountBar from "./AccountBar";
import BookmarkList from "./BookmarkList";

import TabBar from "./TabBar";
import useAuth from "../../hooks/useKakaoLogin";
import { useNavigate } from "react-router-dom";
import { getUserToken } from "../../utills/persistentStorage";
import { ROUTE_PATH } from "../../constant/route";

const BookmarkArea = () => {
  const navigate = useNavigate();
  const token = getUserToken();
  const { login, logout } = useAuth();

  const [isBookmarkCardOn, setIsBookmarkCardOn] = useState(false);

  const isAtHome = !token && !isBookmarkCardOn;
  const isOnLogin = token;
  const isOnBookmark = isBookmarkCardOn || token;

  const handleBookmarkCard = () => {
    setIsBookmarkCardOn(!isBookmarkCardOn);
  };

  const handleLogin = () => {
    login();
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTE_PATH.HOME);
  };

  return (
    <Box as="div">
      <TabBar
        isAtHome={isAtHome}
        isOnBookmark={isOnBookmark}
        isOnLogin={isOnLogin}
        handleBookmarkArea={handleBookmarkCard}
      />
      <Box as="section" display="flex" flexDir="column" gap={4}>
        {isAtHome && (
          <>
            <EmployeeLoginButton />
            <LoginButton onLogin={handleLogin} />
            <BookmarkButton onClick={handleBookmarkCard} />
          </>
        )}
        {isOnBookmark && <BookmarkList />}
        {token && <AccountBar onLogout={handleLogout} />}
      </Box>
    </Box>
  );
};

export default BookmarkArea;
