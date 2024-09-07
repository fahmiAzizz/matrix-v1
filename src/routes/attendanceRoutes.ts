import { Router } from "express";
import { clockIn, clockOut, getAttendanceListByUserId } from "../controllers/attandanceController";

const router = Router();

router.post('/clockIn/:user_id', clockIn);
router.patch('/clockOut/:user_id', clockOut);
router.get('/:user_id', getAttendanceListByUserId)

export default router;