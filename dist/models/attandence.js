"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const base_1 = require("./base");
class Attendance extends sequelize_1.Model {
}
exports.default = (sequelize) => {
    Attendance.init(Object.assign(Object.assign({ id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        } }, base_1.BaseModel.initializeAttributes()), { user_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        }, absence_type: {
            type: sequelize_1.DataTypes.ENUM('present', 'sick', 'leave', 'absent'),
            allowNull: false,
        }, clock_in_time: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        }, clock_out_time: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        }, total_hours: {
            type: sequelize_1.DataTypes.DECIMAL,
            allowNull: true,
        }, date: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        } }), {
        sequelize,
        tableName: 'Attendance',
        timestamps: true,
        paranoid: true,
    });
    return Attendance;
};
