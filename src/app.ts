import express from 'express';
import userRoute from './routes/userRoute'
import employeeRoute from './routes/employeeRoute'
import roleRoute from './routes/roleRoute'
import authRoute from './routes/authRoute'
import attendanceRoute from './routes/attendanceRoutes'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import db from './config/db';
import cors from 'cors';
import { verifyToken } from './middleware/authMiddleware';
import dotenv from 'dotenv';
dotenv.config()


const app = express();
const port = Number(process.env.PORT) || 5000


db.sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
        return db.sequelize.sync({ alter: false }); // Sync all models
    })
    .then(() => {
        console.log('Database synced successfully.');
    })
    .catch((error: Error) => {
        console.error('Unable to connect to the database or sync models:', error);
    });



app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/v1', authRoute)
app.use('/v1/user', verifyToken, userRoute)
app.use('/v1/employee', verifyToken, employeeRoute)
app.use('/v1/role', verifyToken, roleRoute)
app.use('/v1/attendance', verifyToken, attendanceRoute)



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
