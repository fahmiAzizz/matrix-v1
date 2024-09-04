"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const base_1 = require("./base");
class Role extends sequelize_1.Model {
}
exports.default = (sequelize) => {
    Role.init(Object.assign(Object.assign({ id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        } }, base_1.BaseModel.initializeAttributes()), { role_name: {
            type: sequelize_1.DataTypes.STRING,
            unique: true,
            allowNull: false,
        } }), {
        sequelize,
        tableName: 'Roles',
        timestamps: true,
        paranoid: true,
    });
    return Role;
};
