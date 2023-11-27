# 노인복지관 프로젝트

<img width="200" alt="스크린샷 2023-11-27 오후 9 43 22" src="https://user-images.githubusercontent.com/81420856/285865555-f6014d82-c2f8-48db-a109-a26efd7c5c41.png">

## 📌 프로젝트 소개

### 제품

노인복지관을 이용 가능한 어르신들이 서울시 내에 있는 노인복지관의 정보를 `쉽게 접할` 수 있고, 기술 사용에 어려움이 많은 어르신들이 `사용하기 쉬운` 노인복지관 정보 제공 플랫폼을 만들고자 합니다.

서울시 내에는 만 60세 이상의 어르신들이 이용할 수 있는 노인복지관이 총 87개 있습니다. 하지만 현재 각각의 노인복지관에 대한 정보를 얻기 위해서는 서울시 노인복지관 홈페이지 혹은 각 복지관별 홈페이지를 방문해야 하는 번거로움이 있습니다.

또한, 최근 노인복지관의 명칭이 각 복지관 별로 상이하고, 정말 특이한 이름들이 많아 어르신분들이 해당 복지관이 노인복지관인지 알기 어렵습니다. 예를 들어, 방배느티나무쉼터이라는 명칭의 복지관을 보면 여기가 노인복지관인지 타시설인지 확인하기 어려워 어르신들이 해당 복지관을 이용하지 못하는 경우가 많습니다.

그리고 해당 복지관에 대해 사용 자격이 있는지, 해당 복지관에서 제공하는 서비스가 무엇인지 등의 정보를 얻기 위해서 현재는 어르신들이 해당 복지관에 전화를 걸어 직접 문의해야 합니다. 이러한 문의는 어르신들에게 불편함을 주고, 복지관에게도 불편함을 주는 일입니다.

이러한 불편함을 해소하고, 어르신들의 `정보 접근성`을 높이기 위해, 노인복지관의 정보를 제공해주는 웹사이트 및 앱을 개발 중에 있습니다.

### 개발

- 프로덕트의 기획과 디자인,
- 프론트엔드와 백엔드 개발,
- 서버 구축 및 배포,
- 유지 보수와 리팩토링까지,

서비스의 라이프사이클 전반을 경험하고자 합니다.

## 📌 프로젝트 개발 기간

- 1차 기능 개발 완료: 2023.11.08 ~ 2023.11.27
- 배포 및 유지 보수: 2023.11.28 ~ 현재

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
- TanStack Query, Context API
- Vite
- react-daum-postcode

### Backend

- Node.js, Express, axios
- MongoDB, Mongoose
- Jest, Supertest

### CI/CD

- Github Actions

### ETC

- Notion, Figma, Postman, Git, Github
- 카카오 로그인 API, 카카오 맵 API
- 데이터 출처: [서울특별시 노인복지관 현황](https://data.seoul.go.kr/dataList/OA-15067/S/1/datasetView.do)
