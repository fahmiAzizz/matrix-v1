import { Router } from 'express';
import userRoute from './userRoute';
import employeeRoute from './employeeRoute';
import roleRoute from './roleRoute';
import authRoute from './authRoute';
import attendanceRoute from './attendanceRoutes';
import { verifyToken } from '../middleware/authMiddleware';

const baseRoute = Router();

baseRoute.use('/', authRoute);
baseRoute.use('/user', verifyToken, userRoute);
baseRoute.use('/employee', verifyToken, employeeRoute);
baseRoute.use('/role', verifyToken, roleRoute);
baseRoute.use('/attendance', verifyToken, attendanceRoute);

export default baseRoute;
