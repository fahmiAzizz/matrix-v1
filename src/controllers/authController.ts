import { Request, Response } from 'express';
import db from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await db.User.findOne({
            where: { username },
            include: [{
                model: db.Employee,
                as: 'employee'
            }]
        });

        if (!user) {
            return res.status(401).json({ message: 'User Not Found!' });
        }


        if (!user.employee || !['Admin', 'Employee', 'HR'].includes(user.employee.role)) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Password!' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.employee.role },
            process.env.JWT_KEY!,
            { expiresIn: '1h' }
        );

        await user.update({ token });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false
        });

        return res.status(200).json({ token, user, message: 'Login Successfully' });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ message: 'An error occurred during login', error: err.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.sendStatus(204);
        const user = await db.User.findOne({
            where: {
                token: token
            }
        })
        if (!user) return res.sendStatus(204);
        const UserId = user.id;
        await db.User.update({ token: null }, {
            where: {
                id: UserId
            }
        })
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ message: 'An error occurred during logout', error: err.message });
    }
};