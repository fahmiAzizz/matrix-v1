import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { BaseAttributes, BaseModel } from './base';
import { v4 as uuidv4 } from 'uuid';

interface UserAttributes extends BaseAttributes {
    id: number;
    employee_id: number;
    username: string;
    password: string;
    token: string;
    created_at?: Date;
    updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }


class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public employee_id!: number;
    public username!: string;
    public password!: string;
    public token!: string;
    public created_at!: Date;
    public updated_at!: Date;
    public id_external?: string | undefined;
}


export default (sequelize: Sequelize) => {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        ...BaseModel.initializeAttributes(),
        employee_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Employees',
                key: 'id',
            },
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        sequelize,
        tableName: 'Users',
        timestamps: true,
        paranoid: true,
    });

    return User;
};
