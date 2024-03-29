import express from 'express';

import { httpGetAllDistricts } from './districts.controller.js';

const districtsRouter = express.Router();

districtsRouter.get('/', httpGetAllDistricts);

export default districtsRouter;
