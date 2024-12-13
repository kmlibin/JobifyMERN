import { Router } from "express";
const router = Router()

import { getCurrentUser, getApplicationStats, updateUser } from "../controllers/userController.js";
import { validateUpdateUserInput } from "../middleware/validationMiddleware.js";
import {authorizePermissions} from '../middleware/authMiddleware.js'
import upload from '../middleware/multerMiddleware.js'


//we already protected these routes in server.js - user already has to be authed to get here
router.get('/current-user', getCurrentUser)
router.get('/admin/app-stats', authorizePermissions("admin"), getApplicationStats)
//with upload, we will now have access to req.file on the updateUser controller
router.patch('/update-user', upload.single('avatar'), validateUpdateUserInput, updateUser)

export default router