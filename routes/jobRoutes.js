import { Router } from "express";
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
} from "../controllers/jobController.js";

router.route("/").get(getAllJobs).post(validateJobInput, createJob);
router
  .route("/:id")
  .get(validateIdParam, getJob)
  .patch(validateJobInput, validateIdParam, editJob)
  .delete(validateIdParam, deleteJob);

export default router;
