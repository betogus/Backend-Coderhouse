import { Router } from "express";
import { getOrderById, postOrder } from "../controllers/order.controller.js";


const router = Router()

router.post('/', postOrder)
router.get('/', getOrderById)

export default router