import { Router } from "express";

import { getCart } from "../controllers/cart.controller.js";
import { isAuth } from "../middlewares/middlewares.js";
const router = Router()

router.get('/', isAuth, getCart)

export default router