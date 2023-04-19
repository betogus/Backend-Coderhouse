import { Router } from "express"
import { validateApi } from "../middlewares/middlewares.js"
import { deleteApi, getApi, getApiById, postApi, putApi } from "../controllers/api.controller.js"


const router = Router()

router.get('/', getApi)
router.get('/:id', getApiById)
router.post('/', validateApi, postApi)
router.put('/:id', validateApi, putApi)
router.delete('/:id', deleteApi)
export default router