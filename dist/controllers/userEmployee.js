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
exports.deleteUserAndEmployee = exports.updateUserAndEmployee = exports.createUserAndEmployee = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUserAndEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, nik, gender, role, phone_number, address, date_of_birth } = req.body;
    const transaction = yield db_1.default.sequelize.transaction();
    const username = nik;
    const password = first_name + nik.substring(0, 6);
    try {
        const existingEmployee = yield db_1.default.Employee.findOne({ where: { nik }, paranoid: false });
        if (existingEmployee) {
            const error = new Error('NIK alredy exists');
            error.name = "UniqueConstraintError";
            throw error;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newEmployee = yield db_1.default.Employee.create({
            first_name,
            last_name,
            nik,
            gender,
            role,
            phone_number,
            address,
            date_of_birth,
        }, { transaction });
        const newUser = yield db_1.default.User.create({
            employee_id: newEmployee.id,
            username,
            password: hashedPassword,
        }, { transaction });
        yield transaction.commit();
        return res.status(201).json({
            message: 'User and Employee created successfully',
            employee: newEmployee,
            user: newUser,
        });
    }
    catch (error) {
        const err = error;
        yield transaction.rollback();
        if (err.name === 'UniqueConstraintError') {
            return res.status(400).json({
                message: err.message,
            });
        }
        else {
            return res.status(500).json({
                message: 'An error occurred while creating User and Employee',
                error: err.message,
            });
        }
    }
});
exports.createUserAndEmployee = createUserAndEmployee;
const updateUserAndEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { first_name, last_name, nik, gender, role, phone_number, address, date_of_birth } = req.body;
    const transaction = yield db_1.default.sequelize.transaction();
    const username = nik;
    const password = first_name + nik.substring(0, 6);
    try {
        const employee = yield db_1.default.Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const existingEmployee = yield db_1.default.Employee.findOne({
            where: { nik, id: { [db_1.default.Sequelize.Op.ne]: id } }, paranoid: false
        });
        if (existingEmployee) {
            return res.status(400).json({ message: 'NIK already exists for another employee' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield db_1.default.Employee.update({
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
        yield db_1.default.User.update({
            username,
            password: hashedPassword
        }, {
            where: { employee_id: id },
            transaction
        });
        yield transaction.commit();
        return res.status(200).json({ message: 'Employee updated successfully' });
    }
    catch (error) {
        const err = error;
        yield transaction.rollback();
        return res.status(500).json({
            message: 'An error occurred while updating Employee',
            error: err.message,
        });
    }
});
exports.updateUserAndEmployee = updateUserAndEmployee;
const deleteUserAndEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const transaction = yield db_1.default.sequelize.transaction();
    try {
        const user = yield db_1.default.Employee.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        yield db_1.default.Employee.destroy({
            where: { id: id },
            transaction,
        });
        yield db_1.default.User.destroy({
            where: { employee_id: id },
            transaction,
        });
        yield transaction.commit();
        return res.status(200).json({ message: 'User and Employee deleted successfully' });
    }
    catch (error) {
        const err = error;
        yield transaction.rollback();
        return res.status(500).json({
            message: 'An error occurred while deleting User and Employee',
            error: err.message,
        });
    }
});
exports.deleteUserAndEmployee = deleteUserAndEmployee;
