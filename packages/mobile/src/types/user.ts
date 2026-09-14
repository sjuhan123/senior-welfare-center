// 로그인 후 로컬 상태(userInfoAtom)에 들고 있는 값만 담음.
// 서버 응답 전체 모양(User/UserResponse)은 @common/shared 참고.
export type UserKakaoInfo = {
  userName: string;
  userAvatar: string;
};
