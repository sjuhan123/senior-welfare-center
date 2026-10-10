export const formatSince = (isoDate: string) => {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return '가입일 확인 중';
  }

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월부터`;
};
