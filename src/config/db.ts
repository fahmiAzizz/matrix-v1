import { Sequelize } from 'sequelize';
import UserModel from '../models/user';
import RoleModel from '../models/role';
import EmployeeModel from '../models/employee';
import AttendanceModel from '../models/attendance';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DBNAME || 'matrix_v1',
    username: process.env.DBUSER || 'root',
    password: process.env.PASSWORD || '',
    host: process.env.HOST || 'localhost',
    dialect: 'mysql',
    dialectModule: mysql2

});

const db: any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.Role = RoleModel(sequelize);
db.Employee = EmployeeModel(sequelize);
db.User = UserModel(sequelize);
db.Attendance = AttendanceModel(sequelize);

db.User.belongsTo(db.Employee, { foreignKey: 'employee_id', targetKey: 'id', as: 'employee' });
db.Employee.hasOne(db.User, { foreignKey: 'employee_id', sourceKey: 'id', as: 'user' });


db.Role.hasMany(db.Employee, { foreignKey: 'role', sourceKey: 'role_name' });
db.Employee.belongsTo(db.Role, { foreignKey: 'role', targetKey: 'role_name' });

db.Attendance.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' })
db.User.hasMany(db.Attendance, { foreignKey: 'user_id', sourceKey: 'id' })

export default db;
