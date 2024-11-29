import { Router } from "express";
const router = Router()

import { getCurrentUser, getApplicationStats, updateUser } from "../controllers/userController.js";
import { validateUpdateUserInput } from "../middleware/validationMiddleware.js";
import {authorizePermissions} from '../middleware/authMiddleware.js'


//we already protected these routes in server.js - user already has to be authed to get here
router.get('/current-user', getCurrentUser)
router.get('/admin/app-stats', authorizePermissions("admin"), getApplicationStats)
router.patch('/update-user', validateUpdateUserInput, updateUser)

export default router