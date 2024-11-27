import { Router } from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import { validateRegisterInput,validateLoginInput } from "../middleware/validationMiddleware.js";

const router = Router();

router.post("/register", validateRegisterInput, registerUser);
router.post("/login", validateLoginInput, loginUser);

export default router;
