import { Router } from "express";
import { getOrderById, postOrder } from "../controllers/order.controller.js";
import { isAuth } from "../middlewares/middlewares.js";


const router = Router()

router.post('/', postOrder)
router.get('/', isAuth, getOrderById)

export default router