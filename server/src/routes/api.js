import express from "express";

import welfaresRouter from "./welfares/welfares.router.js";
import districtsRouter from "./districts/districts.router.js";

const api = express.Router();

api.use("/welfares", welfaresRouter);
api.use("/districts", districtsRouter);

export default api;
