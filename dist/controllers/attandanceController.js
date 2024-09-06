"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceListByUserId = exports.clockOut = exports.clockIn = void 0;
const db_1 = __importDefault(require("../config/db"));
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};
const clockIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const date = getTodayDate();
    try {
        const existingAttendance = yield db_1.default.Attendance.findOne({
            where: { user_id, date },
        });
        if (existingAttendance) {
            return res.status(400).json({ message: 'User sudah absen masuk hari ini' });
        }
        const newAttendance = yield db_1.default.Attendance.create({
            user_id,
            date,
            absence_type: 'present',
            clock_in_time: new Date(),
        });
        return res.status(201).json({
            message: 'Absen masuk berhasil',
            data: newAttendance,
        });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({
            message: 'Terjadi kesalahan saat absen masuk',
            error: err.message,
        });
    }
});
exports.clockIn = clockIn;
const clockOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    try {
        const attendance = yield db_1.default.Attendance.findOne({
            where: { user_id, clock_out_time: null },
        });
        if (!attendance || !attendance.clock_in_time) {
            return res.status(400).json({ message: 'Absen masuk tidak ditemukan' });
        }
        const clockOutTime = new Date();
        const totalHours = (clockOutTime.getTime() - attendance.clock_in_time.getTime()) / 3600000;
        attendance.clock_out_time = clockOutTime;
        attendance.total_hours = totalHours;
        yield attendance.save();
        return res.status(200).json({
            message: 'Absen keluar berhasil',
            data: attendance,
        });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({
            message: 'Terjadi kesalahan saat absen keluar',
            error: err.message,
        });
    }
});
exports.clockOut = clockOut;
const getAttendanceListByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.user_id, 10);
    try {
        const attendances = yield db_1.default.Attendance.findAll({
            where: { user_id: userId },
            order: [['date', 'DESC']] // Mengurutkan berdasarkan tanggal terbaru terlebih dahulu
        });
        if (attendances.length === 0) {
            return res.status(404).json({ message: 'No attendance records found for this user' });
        }
        res.status(200).json(attendances);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: 'An error occurred while retrieving attendance records', error: err.message });
    }
});
exports.getAttendanceListByUserId = getAttendanceListByUserId;
