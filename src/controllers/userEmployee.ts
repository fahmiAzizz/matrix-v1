import { Request, Response } from 'express';
import db from '../config/db';
import bcrypt from 'bcrypt';



export const createUserAndEmployee = async (req: Request, res: Response) => {
    const { first_name, last_name, nik, gender, role, phone_number, address, date_of_birth } = req.body;

    const transaction = await db.sequelize.transaction();
    const username = nik;
    const password = first_name + nik.substring(0, 6);

    try {
        const existingEmployee = await db.Employee.findOne({ where: { nik }, paranoid: false });
        if (existingEmployee) {
            const error = new Error('NIK alredy exists');
            error.name = "UniqueConstraintError";
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = await db.Employee.create({
            first_name,
            last_name,
            nik,
            gender,
            role,
            phone_number,
            address,
            date_of_birth,
        }, { transaction });

        const newUser = await db.User.create({
            employee_id: newEmployee.id,
            username,
            password: hashedPassword,
        }, { transaction });

        await transaction.commit();

        return res.status(201).json({
            message: 'User and Employee created successfully',
            employee: newEmployee,
            user: newUser,
        });
    } catch (error) {
        const err = error as Error;
        await transaction.rollback();
        if (err.name === 'UniqueConstraintError') {
            return res.status(400).json({
                message: err.message,
            })
        } else {
            return res.status(500).json({
                message: 'An error occurred while creating User and Employee',
                error: err.message,
            });
        }
    }
}

export const updateUserAndEmployee = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { first_name, last_name, nik, gender, role, phone_number, address, date_of_birth } = req.body;

    const transaction = await db.sequelize.transaction();
    const username = nik;
    const password = first_name + nik.substring(0, 6);


    try {
        const employee = await db.Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const existingEmployee = await db.Employee.findOne({
            where: { nik, id: { [db.Sequelize.Op.ne]: id } }, paranoid: false
        });
        if (existingEmployee) {
            return res.status(400).json({ message: 'NIK already exists for another employee' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.Employee.update({
            first_name,
            last_name,
            nik,
            gender,
            role,
            phone_number,
            address,
            date_of_birth,
        }, {
            where: { id: id },
            transaction,
        });

        await db.User.update({
            username,
            password: hashedPassword
        }, {
            where: { employee_id: id },
            transaction
        });

        await transaction.commit();

        return res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
        const err = error as Error;
        await transaction.rollback();

        return res.status(500).json({
            message: 'An error occurred while updating Employee',
            error: err.message,
        });
    }
};

export const deleteUserAndEmployee = async (req: Request, res: Response) => {
    const { id } = req.params;

    const transaction = await db.sequelize.transaction();

    try {
        const user = await db.Employee.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await db.Employee.destroy({
            where: { id: id },
            transaction,
        });

        await db.User.destroy({
            where: { employee_id: id },
            transaction,
        });

        await transaction.commit();

        return res.status(200).json({ message: 'User and Employee deleted successfully' });
    } catch (error) {
        const err = error as Error;
        await transaction.rollback();

        return res.status(500).json({
            message: 'An error occurred while deleting User and Employee',
            error: err.message,
        });
    }
};

