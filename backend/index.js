import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";
import { socketHandler } from "./socket.js";

const app = express();
const server = http.createServer(app);

/* ✅ ALLOWED ORIGINS */
const allowedOrigins = [
  "http://localhost:5173",
  "https://cravecart.onrender.com"
];

/* ✅ EXPRESS CORS */
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);

app.use(express.json());
app.use(cookieParser());

/* ✅ SOCKET.IO CORS */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

/* ROUTES */
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

/* SOCKET HANDLER */
socketHandler(io);

/* SERVER */
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  connectDb();
  console.log(`🚀 Server running on port ${PORT}`);
});

// import express from "express"
// import dotenv from "dotenv"
// dotenv.config()
// import connectDb from "./config/db.js"
// import cookieParser from "cookie-parser"
// import authRouter from "./routes/auth.routes.js"
// import cors from "cors"
// import userRouter from "./routes/user.routes.js"

// import itemRouter from "./routes/item.routes.js"
// import shopRouter from "./routes/shop.routes.js"
// import orderRouter from "./routes/order.routes.js"
// import http from "http"
// import { Server } from "socket.io"
// import { socketHandler } from "./socket.js"

// const app=express()
// const server=http.createServer(app)

// const io=new Server(server,{
//    cors:{
//     origin:"https://cravecartt.onrender.com",
//     credentials:true,
//     methods:['POST','GET']
// }
// })

// app.set("io",io)



// const port=process.env.PORT || 5000
// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true
// }))
// app.use(express.json())
// app.use(cookieParser())
// app.use("/api/auth",authRouter)
// app.use("/api/user",userRouter)
// app.use("/api/shop",shopRouter)
// app.use("/api/item",itemRouter)
// app.use("/api/order",orderRouter)

// socketHandler(io)
// server.listen(port,()=>{
//     connectDb()
//     console.log(`server started at ${port}`)
// })

