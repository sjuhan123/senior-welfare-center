# 노인복지관 프로젝트

👉👉 홈페이지 방문하기: https://www.노인복지관.com <br />
👉👉 개편 테스트 페이지 방문하기: https://senior-welfare-center-client.vercel.app/ <br />
👉👉 개편 소스코드로 이동하기: https://github.com/sjuhan123/senior-welfare-center/tree/fe-test <br />
👉👉 모노레포 migration 진행 중입니다: https://github.com/sjuhan123/senior-welfare-center/tree/mono-repo

## 📌 프로젝트 소개

### 제품

노인복지관 이용대상인 어르신들이 서울시 내에 있는 노인복지관의 정보를 `쉽게 접할` 수 있고, IT기기 사용에 어려움이 많은 어르신들에게 `사용하기 쉬운` 노인복지관 정보 제공 플랫폼을 만들고자 합니다.

서울시 내에는 만 60세 이상의 어르신들이 이용할 수 있는 노인복지관은 총 87개 있습니다. 하지만 현재 각각의 노인복지관에 대한 정보를 얻기 위해서는 서울시 노인복지관 홈페이지 혹은 각 복지관별 홈페이지를 찾기위해 네이버,구글 등 검색을 통해 직접 찾아야 하는 번거로움이 있습니다.

또한, 최근 노인복지관의 명칭이 각 복지관 별로 상이하고, 특이한 기관명들이 많아 어르신분들이 해당 기관이 노인복지관인지 알기 어렵습니다. 예를 들어, 방배느티나무쉼터이라는 명칭의 복지관을 보면 이 기관이 노인복지관인지 타시설(ex. 경로당, 노숙인 쉼터 등)인지 확인하기 어려워 어르신들이 해당 복지관을 이용하지 못하는 경우가 많습니다.

(강남시니어플라자를 듣고 노인복지관인지 문화센터인지 헷갈리는 경우도 정말 많음!)

그리고 해당 복지관의 이용자격이 있는지, 해당 복지관에서 제공하는 서비스가 무엇인지 등의 정보를 얻기 위해서 현재는 어르신들이 해당 복지관에 전화를 걸어 문의하시거나, 불편한 몸을 이끌고 직접 기관에 방문하여 문의하시는 경우가 많습니다. 이러한 상황은 복지관 정보를 제공하는 과정에서 어르신들의 불편함이 생기고, 복지관은 어르신들에게 어떻게 간단하고 편리하게 설명을 드려야되는지에 대한 고민의 시간만 늘어가고 있습니다.

이러한 불편함을 해소하고, 어르신들의 `정보 접근성`을 높이기 위해, 노인복지관의 정보를 제공해주는 웹사이트 및 앱을 개발 중에 있습니다.

### 개발

- 단일 레포 / 모노레포 환경에서 공통 모듈 프로젝트, 백엔드 프로젝트, 프론트엔드 프로젝트 구성
- 각 프로젝트 별 자동 배포 pipeline을 구축하여, 코드 변경 시 자동으로 배포되도록 환경 구성

![노인복지관 예상 구조](/public/노인복지관%20예상%20구조.png)

## 📌 프로젝트 홈페이지 소개 v2

- 프로젝트 개편: 2024.02.12 ~ 현재

### 복지관 목록 보기

- 데스크탑 뷰

<img src="https://gist.github.com/assets/81420856/97d9fd57-aecf-446d-9f21-293c189c80fb" width="1000" height="800">

- 모바일 뷰

<img src="https://gist.github.com/assets/81420856/7a80887b-338e-45b9-8f2d-db70830a2fc0" width="240" height="500">

## 📌 프로젝트 홈페이지 소개 v1

- 1차 기능 개발 완료: 2023.11.08 ~ 2023.11.27
- 배포 및 유지 보수: 2023.11.28 ~ 2023.12.12

## 📌 서비스 기능 소개

### 복지관 목록 보기

- 지역별 복지관 목록 보기

<img src="https://user-images.githubusercontent.com/81420856/285915191-a5a6dbe1-eda9-4656-ad71-05c25847955b.gif" width="240" height="500">

### 내 근처 복지관 찾기

- 내 현재 GPS 위치 기준으로 가장 가까운 복지관 2곳 보기

<img src="https://user-images.githubusercontent.com/81420856/285915575-41155f31-b15d-49e5-9b48-f88df85f5560.gif" width="240" height="500">

### 집 근처 복지관 찾기

- 집 주소 기준으로 가장 가까운 복지관 2곳 보기

<img src="https://user-images.githubusercontent.com/81420856/285915594-e7ee36fb-32e3-46a5-aa15-205eac8d2c4e.gif" width="240" height="500">

### 카카오 로그인 및 복지관 북마크

- 카카오 로그인 및 로그아웃
- 복지관 북마크 기능

<img src="https://user-images.githubusercontent.com/81420856/285915604-7d67b270-353e-46e1-9737-ef7194dfbf2c.gif" width="240" height="500">

### 기타 기능

- 복지관 홈페이지 이동
- 복지관 전화걸기
- 복지관 주소 및 전화번호 클립보드 복사

## 📌 프로젝트 기술 스택

### Frontend

- TypeScript, React
- Emotion, Chakra UI, react-icons
- TanStack Query, Context API, Jotai
- Vite
- react-daum-postcode

### Backend

- Node.js, Express, axios
- MongoDB, Mongoose
- Jest, Supertest

### Common

- Yarn Workspaces
- ESLint, Prettier

### Infra

- Github Actions
- Docker, Nginx, AWS EC2, AWS Route 53

### ETC

- Notion, Figma, Postman, Git, Github
- 카카오 로그인 API, 카카오 맵 API
- 데이터 출처: [서울특별시 노인복지관 현황](https://data.seoul.go.kr/dataList/OA-15067/S/1/datasetView.do)
