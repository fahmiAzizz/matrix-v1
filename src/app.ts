import express from 'express';
import baseRoute from './routes/baseRoute';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import db from './config/db';
import cors from 'cors';
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

app.use('/v1', baseRoute)



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
