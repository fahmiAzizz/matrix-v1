import { Request, Response } from 'express';
import db from '../config/db';


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await db.User.findAll();
        res.status(200).json(users);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await db.User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
};