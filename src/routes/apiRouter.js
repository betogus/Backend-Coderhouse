import { Router } from "express"
import { isAdmin, validateApi } from "../middlewares/middlewares.js"
import { deleteApi, getApi, getApiById, postApi, putApi, getApiByCategory } from "../controllers/api.controller.js"


const router = Router()

router.get('/', getApi)
router.get('/category/:categoryId', getApiByCategory)
router.get('/:id', getApiById)
router.post('/', isAdmin, validateApi, postApi)
router.put('/:id', isAdmin, validateApi, putApi)
router.delete('/:id', isAdmin, deleteApi)
export default router