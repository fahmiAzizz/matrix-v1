"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const sequelize_1 = require("sequelize");
class BaseModel extends sequelize_1.Model {
    static initializeAttributes() {
        return {
            id_external: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
            }
        };
    }
}
exports.BaseModel = BaseModel;
