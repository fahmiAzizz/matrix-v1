"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const base_1 = require("./base");
class Employee extends sequelize_1.Model {
}
exports.default = (sequelize) => {
    Employee.init(Object.assign(Object.assign({ id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        } }, base_1.BaseModel.initializeAttributes()), { first_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        }, last_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        }, nik: {
            type: sequelize_1.DataTypes.STRING,
            unique: true,
            allowNull: false,
        }, gender: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        }, role: {
            type: sequelize_1.DataTypes.STRING,
            references: {
                model: 'Roles',
                key: 'role_name',
            },
            allowNull: false,
        }, phone_number: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        }, address: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        }, date_of_birth: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        } }), {
        sequelize,
        tableName: 'Employees',
        timestamps: true,
        paranoid: true,
    });
    return Employee;
};
