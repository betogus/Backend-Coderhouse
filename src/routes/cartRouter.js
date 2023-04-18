import { Router } from "express";

import { getCart } from "../controllers/cart.controller.js";
const router = Router()

router.get('/', getCart)

export default router