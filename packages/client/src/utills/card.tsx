const handleCopyClipBoard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    alert('복사에 실패하였습니다.');
  }
};

const handlePhoneClick = (phone: string) => {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  ) {
    window.location.href = `tel:${phone}`;
  }
};

export { handleCopyClipBoard, handlePhoneClick };
