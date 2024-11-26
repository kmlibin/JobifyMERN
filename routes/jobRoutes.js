import { Router } from "express";
import { validateJobInput } from "../middleware/validationMiddleware.js";
const router = Router();

import {
  getAllJobs,
  createJob,
  deleteJob,
  editJob,
  getJob,
} from "../controllers/jobController.js";

router.route("/").get(getAllJobs).post(validateJobInput, createJob);
router.route("/:id").get(getJob).patch(validateJobInput, editJob).delete(deleteJob);


export default router