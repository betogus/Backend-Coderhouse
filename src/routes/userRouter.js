import { Router } from "express"
import { getUser } from "../controllers/user.controller.js"
import { isAuth } from "../middlewares/middlewares.js"
const router = Router()

router.get('/', isAuth, getUser)

export default router