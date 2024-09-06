import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { BaseAttributes, BaseModel } from './base';

interface AttendanceAttributes extends BaseAttributes {
    id: number;
    user_id: number;
    absence_type: 'present' | 'sick' | 'leave' | 'absent';
    clock_in_time?: Date;
    clock_out_time?: Date;
    total_hours?: number;
    date: Date;
    created_at?: Date;
    updated_at?: Date;
}

interface AttendanceCreationAttributes extends Optional<AttendanceAttributes, 'id' | 'clock_in_time' | 'clock_out_time' | 'total_hours' | 'created_at' | 'updated_at'> { }

class Attendance extends Model<AttendanceAttributes, AttendanceCreationAttributes> implements AttendanceAttributes {
    public id!: number;
    public user_id!: number;
    public absence_type!: 'present' | 'sick' | 'leave' | 'absent';
    public clock_in_time!: Date;
    public clock_out_time!: Date;
    public total_hours!: number;
    public date!: Date;
    public created_at!: Date;
    public updated_at!: Date;
    public id_external?: string;
}

export default (sequelize: Sequelize) => {
    Attendance.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        ...BaseModel.initializeAttributes(),
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        absence_type: {
            type: DataTypes.ENUM('present', 'sick', 'leave', 'absent'),
            allowNull: false,
        },
        clock_in_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        clock_out_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        total_hours: {
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'Attendance',
        timestamps: true,
        paranoid: true,
    });

    return Attendance;
};
