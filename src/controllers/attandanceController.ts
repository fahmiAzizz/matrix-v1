import { Request, Response } from 'express';
import db from '../config/db';

const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

export const clockIn = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const date = getTodayDate();

    try {
        const existingAttendance = await db.Attendance.findOne({
            where: { user_id, date },
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'You Has Already Clocked Today' });
        }

        const newAttendance = await db.Attendance.create({
            user_id,
            date,
            absence_type: 'present',
            clock_in_time: new Date(),
        });

        return res.status(201).json({
            message: 'Clock In Successful',
            data: newAttendance,
        });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({
            message: 'An Error Occurred During Clock In',
            error: err.message,
        });
    }
};


export const clockOut = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    try {
        const attendance = await db.Attendance.findOne({
            where: { user_id, clock_out_time: null },
        });

        if (!attendance || !attendance.clock_in_time) {
            return res.status(400).json({ message: "You Have Not Clock In Yet" });
        }

        if (attendance.clock_out_time) {
            return res.status(400).json({ message: "You Have Already Clocked Out Today" });
        }

        const clockOutTime = new Date();
        const totalHours = (clockOutTime.getTime() - attendance.clock_in_time.getTime()) / 3600000;

        attendance.clock_out_time = clockOutTime;
        attendance.total_hours = totalHours;
        await attendance.save();

        return res.status(200).json({
            message: 'Clock Out Successful',
            data: attendance,
        });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({
            message: 'An Error Occurred During Clock Out',
            error: err.message,
        });
    }
};

export const getAttendanceListByUserId = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.user_id, 10);

    try {
        const attendances = await db.Attendance.findAll({
            where: { user_id: userId },
            order: [['date', 'DESC']] // Mengurutkan berdasarkan tanggal terbaru terlebih dahulu
        });

        if (attendances.length === 0) {
            return res.status(404).json({ message: 'No attendance records found for this user' });
        }

        res.status(200).json(attendances);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'An error occurred while retrieving attendance records', error: err.message });
    }
};

