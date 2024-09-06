import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import db from '../config/db';

declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
    }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        jwt.verify(token, process.env.JWT_KEY || '403836y48354348f', async (err: any, decoded: any) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token.' });
            }
            const payload = decoded as JwtPayload;
            const user = await db.User.findOne({
                where: { id: payload.userId, token },
                include: [{
                    model: db.Employee,
                    as: 'employee'
                }]
            });
            if (!user) {
                return res.status(401).json({ message: 'User not found or token does not match.' });
            }
            req.user = {
                id: user.id,
                username: user.username,
                role: user.employee.role,
            };
            next();
        });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ message: 'An error occurred while verifying the token', error: err.message });
    }
};
