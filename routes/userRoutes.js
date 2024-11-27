import { Router } from "express";
import {
  loginUser,
  logout,
  registerUser,
} from "../controllers/userController.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../middleware/validationMiddleware.js";

const router = Router();

router.post("/register", validateRegisterInput, registerUser);
router.post("/login", validateLoginInput, loginUser);
router.get("/logout", logout);

export default router;
