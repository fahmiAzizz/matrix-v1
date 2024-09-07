"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoute_1 = __importDefault(require("./userRoute"));
const employeeRoute_1 = __importDefault(require("./employeeRoute"));
const roleRoute_1 = __importDefault(require("./roleRoute"));
const authRoute_1 = __importDefault(require("./authRoute"));
const attendanceRoutes_1 = __importDefault(require("./attendanceRoutes"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const baseRoute = (0, express_1.Router)();
baseRoute.use('/', authRoute_1.default);
baseRoute.use('/user', authMiddleware_1.verifyToken, userRoute_1.default);
baseRoute.use('/employee', authMiddleware_1.verifyToken, employeeRoute_1.default);
baseRoute.use('/role', authMiddleware_1.verifyToken, roleRoute_1.default);
baseRoute.use('/attendance', authMiddleware_1.verifyToken, attendanceRoutes_1.default);
exports.default = baseRoute;
