import express from "express";

import { httpGetAllWelfares } from "./welfares.controller.js";

const welfaresRouter = express.Router();

welfaresRouter.get("/", httpGetAllWelfares);

export default welfaresRouter;
