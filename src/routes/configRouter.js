import { Router } from "express";
import { isAdmin } from "../middlewares/middlewares.js";
import { getConfig } from "../controllers/config.controller.js";


const router = Router()

router.get('/', isAdmin, getConfig)



export default router