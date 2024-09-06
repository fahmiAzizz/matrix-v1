"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attandanceController_1 = require("../controllers/attandanceController");
const router = (0, express_1.Router)();
router.post('/clockIn/:user_id', attandanceController_1.clockIn);
router.post('/clockOut/:user_id', attandanceController_1.clockOut);
router.get('/:user_id', attandanceController_1.getAttendanceListByUserId);
exports.default = router;
