import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js"
import cors from "cors"

dotenv.config();

const app=express();
const port=process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


connectDB();
app.listen(port,()=>{
    console.log(`server started at ${port}`)
})