import { Router } from "express";
import { checkForTestUser } from "../middleware/authMiddleware.js";
import {
  validateJobInput,
  validateIdParam,
} from "../middleware/validationMiddleware.js";
const router = Router();

import {
  getAllJobs,
  createJob,
  deleteJob,
  editJob,
  getJob,
  showStats,
} from "../controllers/jobController.js";

router.route("/").get(getAllJobs).post(checkForTestUser, validateJobInput, createJob);
router.route("/stats").get(showStats)
router
  .route("/:id")
  .get(validateIdParam, getJob)
  .patch(checkForTestUser, validateJobInput, validateIdParam, editJob)
  .delete(checkForTestUser, validateIdParam, deleteJob);

export default router;
