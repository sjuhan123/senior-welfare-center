import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import api from './routes/api.js';

const app = express();

// 보안 미들웨어
app.use(helmet());

// TODO: contentSecurityPolicy 학습 후 리펙토링 혹은 코드 수정 필요
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'script-src': [
        "'self'",
        'https://t1.daumcdn.net',
        'https://postcode.map.daum.net',
        'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
      ],
      'img-src': [
        "'self'",
        'https://user-images.githubusercontent.com',
        'https://k.kakaocdn.net',
      ],
      'frame-src': ["'self'", 'https://postcode.map.daum.net/'],
      'connect-src': ["'self'", 'https://dapi.kakao.com'],
      'manifest-src': ["'self'", 'data:'],
    },
  }),
);

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://senior-welfare-center-client.vercel.app',
    ],
  }),
);

// 로그 미들웨어
app.use(morgan('combined'));

app.use(express.json());

app.use('/api', api);

export default app;
