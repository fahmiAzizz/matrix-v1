"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const baseRoute_1 = __importDefault(require("./routes/baseRoute"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 5000;
db_1.default.sequelize.authenticate()
    .then(() => {
    console.log('Database connection has been established successfully.');
    return db_1.default.sequelize.sync({ alter: false }); // Sync all models
})
    .then(() => {
    console.log('Database synced successfully.');
})
    .catch((error) => {
    console.error('Unable to connect to the database or sync models:', error);
});
app.use((0, cors_1.default)({ credentials: true, origin: true }));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/v1', baseRoute_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
