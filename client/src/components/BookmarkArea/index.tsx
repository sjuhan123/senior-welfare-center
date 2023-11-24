import LoginButton from "../common/Button/LoginButton";
import EmployeeLoginButton from "../common/Button/EmployeeLoginButton";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

import BookmarkButton from "../common/Button/BookmarkButton";
import { useQuery } from "react-query";
import AccountBar from "./AccountBar";
import { UserResponse } from "../../types/user";
import BookmarkList from "./BookmarkList";

import TabBar from "./TabBar";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const BookmarkArea = () => {
  const navigate = useNavigate();
  const { data: userInfo } = useQuery<UserResponse>("userInfo");
  const { logout } = useAuth();

  const [isBookmarkCardOn, setIsBookmarkCardOn] = useState(false);

  const isAtHome = !userInfo && !isBookmarkCardOn;
  const isOnLogin = userInfo;
  const isOnBookmark = isBookmarkCardOn || userInfo;

  const kakaoLogin = `https://kauth.kakao.com/oauth/authorize?client_id=${
    import.meta.env.VITE_KAKAO_API_KEY
  }&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;

  const handleBookmarkCard = () => {
    setIsBookmarkCardOn(!isBookmarkCardOn);
  };

  const handleLogin = () => {
    window.location.href = kakaoLogin;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
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
        {userInfo && (
          <AccountBar userInfo={userInfo.data} onLogout={handleLogout} />
        )}
      </Box>
    </Box>
  );
};

export default BookmarkArea;
