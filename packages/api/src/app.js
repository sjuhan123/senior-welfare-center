import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import * as Sentry from '@sentry/node';

import api from './routes/api.js';

const app = express();

// 보안 미들웨어
app.use(helmet());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://100.79.188.45:5173', // 아이패드(Tailscale) 원격 개발용 맥 Tailscale IP
      'https://dev.uri-bokji.com',
      'https://uri-bokji.com',
    ],
    credentials: true,
  }),
);

// 로그 미들웨어
app.use(morgan('combined'));

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());

/** 블루그린 배포 스크립트가 새 컨테이너의 준비 여부를 확인하는 용도 */
app.get('/health', (req, res) => res.status(200).send('ok'));

app.use('/api', api);

Sentry.setupExpressErrorHandler(app);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || '서버 오류가 발생했습니다' });
});

export default app;
