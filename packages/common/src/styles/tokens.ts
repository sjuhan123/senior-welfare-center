// 앱(mobile)과 어드민(admin)이 함께 쓰는 원시 디자인 토큰.
// 원래 디자인은 oklch로 정의됐지만, React Native StyleSheet가 oklch()를
// 파싱하지 못해 hex로 변환해서 하나의 값만 유지함(변환은 sRGB 기준이라
// 원본과 시각적으로 동일, 저채도 팔레트라 감마 변환 손실도 없음).

export const color = {
  // 잉크빛 남색: 기본 동작, 확인 상태, 어드민 사이드바
  navy: '#2d3d5a',
  navyDeep: '#1e2d49',
  navySoft: '#dee7f5',
  navyTint: '#f3f6fb',

  // 흙갈색: 전화, 시간, 오늘 같은 "지금 벌어지는 일"
  brown: '#6c4a30', // 프로토타입 실측값(oklch(0.44 0.06 58))으로 갱신
  brownDeep: '#583b24',
  brownSoft: '#f2e8dd',
  brownTint: '#f9f2eb',
  brownMark: '#996439', // 점, 개수 뱃지

  // 붉은 흙: 거절, 비활성, 되돌릴 수 없는 처리
  alert: '#7f463b',
  alertText: '#703d33',
  alertLine: '#e5c1ba',
  alertTint: '#f5eae8', // 프로토타입 실측값(oklch(0.945 0.012 32))으로 갱신, 기존보다 한 단계 진함

  // 종이 회색 램프 (0 = 흰 종이, 900 = 먹)
  grey0: '#ffffff',
  grey50: '#f5f7f9',
  grey100: '#eef0f3',
  grey150: '#e4e6e9',
  grey200: '#d6d9dd',
  grey300: '#c8cdd1',
  grey400: '#b5b9bf',
  grey500: '#6e7479',
  grey600: '#60656b',
  grey700: '#3b3f43',
  grey800: '#272a2e',
  grey900: '#191c1f',
} as const;

// 뜻으로 부르는 이름. 화면 코드는 primitive 대신 이것만 씁니다.
export const semantic = {
  bgPage: color.grey100,
  bgSurface: color.grey0,
  bgSunken: color.grey50,
  border: color.grey200,
  borderStrong: color.grey400,
  divider: color.grey150,

  textPrimary: color.grey900,
  textSecondary: color.grey700,
  textMuted: color.grey500, // 프로토타입 실사용은 grey600이 아니라 grey500
  textOnDark: color.grey0,

  actionBg: color.navy,
  actionBgHover: color.navyDeep,
  actionFg: color.grey0,
  actionQuietBg: color.grey0,
  actionQuietFg: color.grey900,

  stateOkBg: color.navySoft, // 수락 완료, 확인됨
  stateOkFg: color.navyDeep,
  stateWaitBg: color.brownSoft, // 신청함, 대기중
  stateWaitFg: color.brownDeep,
  stateStopBg: color.alertTint, // 거절, 비활성, 종료
  stateStopFg: color.alertText,
  stateStopBar: color.alert,

  urgent: color.brown, // 전화, 오늘 일정
  countBadge: color.brownMark,

  ctaBg: color.brown, // 시작하기/QR 찍기 등 온보딩 흐름의 주요 CTA
  ctaFg: color.grey0,
} as const;

export const font = {
  family: "'IBM Plex Sans KR', system-ui, sans-serif",
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
} as const;

// 글자 크기는 플랫폼마다 다릅니다 (아래 scale.mobile / scale.admin).
// 공통으로 두는 것은 배율과 행간 규칙뿐입니다.
export const lineHeight = { tight: 1.35, normal: 1.6, loose: 1.75 } as const;

export const scale = {
  // 어르신용: rem 대신 배율. 사용자가 "글씨 크게"를 누르면 base만 17 -> 20으로 바뀝니다.
  mobile: {
    base: 17,
    // 프로토타입 실측 24개 배율을, 육안으로 구분 안 되는 값끼리 묶어서 10단계로 정리
    // (1.2/1.3 -> lg, 1.35/1.45 -> xl, 1.7 -> xxxl로 흡수)
    step: {
      caption: 0.95,
      xs: 1,
      sm: 1.05,
      base: 1.1,
      md: 1.15,
      lg: 1.25,
      xl: 1.4,
      xxl: 1.5,
      xxxl: 1.75,
      display: 2.05,
    },
    userScale: [1, 1.15, 1.32], // 프로토타입 실측: 2단계가 아니라 3단계
  },
  // 어드민: 고정 px. 표와 폼 밀도를 유지합니다.
  admin: {
    caption: 11.5,
    small: 12.5,
    body: 13, // 13.5 -> 13 (프로토타입 실측 최빈값 73회, 기존 13.5는 24회라 13으로 통일)
    bodyStrong: 14,
    label: 14.5,
    title: 15,
    section: 16,
    pageTitle: 22,
    hero: 30,
  },
} as const;

export const space = [0, 4, 6, 8, 10, 12, 14, 16, 18, 22, 26, 34, 44] as const;

// mobile/admin 실측값이 서로 달라서(예: 버튼/카드 반경) 플랫폼별로 나눔.
export const radius = {
  none: 0,
  label: 4, // 태그, 상태 라벨 (각진 관공서 느낌) — 양쪽 실측 일치
  sheet: 16, // 큰 시트/모달 — 양쪽 실측 일치
  circle: 999,

  mobileButton: 9,
  mobileContainer: 10, // 카드/입력창/알림박스/리스트 아이템 공통

  adminInput: 6,
  adminCard: 8,
  adminBadge: 7, // 아이콘/아바타 사각 배지, 알림 박스
} as const;

export const border = {
  hair: '1px',
  base: '1.5px', // 앱 기본
  accentBar: '7px', // 안내 칸 왼쪽 굵은 줄
  sectionDivider: '9px', // 섹션 사이 두꺼운 회색 구분선(색상은 semantic.divider 재사용)
} as const;

// 손가락과 마우스는 다릅니다. 이 값만은 절대 공통으로 합치지 않습니다.
export const hit = {
  mobileCompact: 56, // 좁은/보조 버튼
  mobileMin: 76, // 어르신용 기본 버튼 최소 높이(실측 최빈값)
  mobileLarge: 92, // 강조 CTA
  mobileNav: 82, // 하단 탭

  adminMin: 34, // 어드민 인풋, 셀렉트 중 가장 좁은 것
  adminInput: 36, // 검색/필터 인풋
  adminButton: 38,
} as const;

export type Color = keyof typeof color;
export type Semantic = keyof typeof semantic;
