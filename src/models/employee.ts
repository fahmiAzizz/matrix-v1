import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { BaseModel, BaseAttributes } from './base';

interface EmployeeAttributes extends BaseAttributes {
    id: number;
    first_name: string;
    last_name: string;
    nik: string;
    gender: string,
    role: string;
    phone_number?: string;
    address?: string;
    date_of_birth?: Date;
    created_at?: Date;
    updated_at?: Date;
}

interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id'> { }


class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
    public id!: number;
    public first_name!: string;
    public last_name!: string;
    public nik!: string;
    public gender!: string;
    public role!: string;
    public phone_number!: string;
    public address!: string;
    public date_of_birth!: Date;
    public created_at!: Date;
    public updated_at!: Date;
    public id_external?: string | undefined;
}


export default (sequelize: Sequelize) => {
    Employee.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        ...BaseModel.initializeAttributes(),
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nik: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            references: {
                model: 'Roles',
                key: 'role_name',
            },
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        date_of_birth: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        sequelize,
        tableName: 'Employees',
        timestamps: true,
        paranoid: true,
    });

    return Employee;
};
