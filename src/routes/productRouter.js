import { Router } from "express";
import { getProduct } from "../controllers/product.controller.js";
import { isAuth } from "../middlewares/middlewares.js";

const router = Router()

router.get('/', isAuth, getProduct) 

export default router