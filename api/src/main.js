import express from 'express';
import "dotenv/config";
import cors from "cors"
import cookieParser from "cookie-parser"
import connectionDB from './config/db.js';
import router from './routes/index.js';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

//http://localhost:3000/api

app.use(express.json())
app.use(cookieParser())
app.use("/api", router)

const PORT = process.env.PORT

app.listen(PORT, () => {
    connectionDB()
    console.log(`Server is running on PORT ${PORT}`);
})