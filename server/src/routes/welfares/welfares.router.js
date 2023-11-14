import express from "express";

import { getAllWelfares } from "./welfares.controller.js";

const welfaresRouter = express.Router();

welfaresRouter.get("/", getAllWelfares);

export default welfaresRouter;
