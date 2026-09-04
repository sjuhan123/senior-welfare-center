import express from 'express';

import {
  httpGetAllWelfares,
  httpGetClosestWelfare,
} from './welfares.controller.js';

const welfaresRouter = express.Router();

welfaresRouter.get('/', httpGetAllWelfares);
welfaresRouter.get('/closest', httpGetClosestWelfare);

export default welfaresRouter;
