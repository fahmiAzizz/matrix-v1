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
exports.logout = exports.login = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield db_1.default.User.findOne({
            where: { username },
            include: [{
                    model: db_1.default.Employee,
                    as: 'employee'
                }]
        });
        if (!user) {
            return res.status(401).json({ message: 'User Not Found!' });
        }
        if (!user.employee || !['Admin', 'Employee', 'HR'].includes(user.employee.role)) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Password!' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.employee.role }, process.env.JWT_KEY, { expiresIn: '1h' });
        yield user.update({ token });
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false
        });
        return res.status(200).json({ token, user, message: 'Login Successfully' });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ message: 'An error occurred during login', error: err.message });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token)
            return res.sendStatus(204);
        const user = yield db_1.default.User.findOne({
            where: {
                token: token
            }
        });
        if (!user)
            return res.sendStatus(204);
        const UserId = user.id;
        yield db_1.default.User.update({ token: null }, {
            where: {
                id: UserId
            }
        });
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logout successful' });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ message: 'An error occurred during logout', error: err.message });
    }
});
exports.logout = logout;
