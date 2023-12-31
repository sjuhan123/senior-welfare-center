import express from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import { fileURLToPath } from "url"; // URL에서 파일 경로로 변환하는 함수
import morgan from "morgan";

import api from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 보안 미들웨어
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": [
        "'self'",
        "https://t1.daumcdn.net",
        "https://postcode.map.daum.net",
        "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js",
        `'sha256-${process.env.DAUM_HASH_KEY}'`,
      ],
      "img-src": [
        "'self'",
        "https://user-images.githubusercontent.com",
        "https://k.kakaocdn.net",
      ],
      "frame-src": ["'self'", "https://postcode.map.daum.net/"],
      "connect-src": ["'self'", "https://dapi.kakao.com"],
      "manifest-src": ["'self'", "data:"],
    },
  })
);

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// 로그 미들웨어
app.use(morgan("combined"));

app.use(express.json());
// 프론트엔드 정적 파일 제공
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/api", api);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export default app;
