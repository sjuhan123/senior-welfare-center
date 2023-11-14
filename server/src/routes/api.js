import express from "express";

import welfaresRouter from "./welfares/welfares.router.js";

const api = express.Router();

api.use("/welfares", welfaresRouter);

export default api;
