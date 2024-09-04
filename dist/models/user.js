"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const base_1 = require("./base");
class User extends sequelize_1.Model {
}
exports.default = (sequelize) => {
    User.init(Object.assign(Object.assign({ id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        } }, base_1.BaseModel.initializeAttributes()), { employee_id: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: 'Employees',
                key: 'id',
            },
        }, username: {
            type: sequelize_1.DataTypes.STRING,
            unique: true,
            allowNull: false,
        }, password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        }, token: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        } }), {
        sequelize,
        tableName: 'Users',
        timestamps: true,
        paranoid: true,
    });
    return User;
};
