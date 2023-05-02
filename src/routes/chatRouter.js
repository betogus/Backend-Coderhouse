import { Router } from "express";
import { getChat } from "../controllers/chat.controller.js";
import { isAuth } from "../middlewares/middlewares.js";

const router = Router()

router.get('/', isAuth, getChat)

export default router