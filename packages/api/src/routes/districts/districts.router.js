import express from 'express';

import { httpGetAllDistricts } from './districts.controller.js';

const districtsRouter = express.Router();

/** 지역(구/군) 목록 조회 */
districtsRouter.get('/', httpGetAllDistricts);

export default districtsRouter;
