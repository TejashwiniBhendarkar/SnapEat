import express from "express";
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";
import { socketHandler } from "./socket.js";

const app = express();
const server = http.createServer(app);

/* =========================
   ✅ CORS (FINAL FIX)
========================= */
const FRONTEND_URL = "https://cravecartt.onrender.com";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* 🔥 REQUIRED FOR RENDER (OPTIONS PREFLIGHT) */
app.options("*", cors({
  origin: FRONTEND_URL,
  credentials: true
}));

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());
app.use(cookieParser());

/* =========================
   SOCKET.IO
========================= */
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"]
  }
});

app.set("io", io);
socketHandler(io);

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 8000;

server.listen(PORT, async () => {
  await connectDb();
  console.log(`🚀 Server running on port ${PORT}`);
});

// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();

// import connectDb from "./config/db.js";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";

// import authRouter from "./routes/auth.routes.js";
// import userRouter from "./routes/user.routes.js";
// import itemRouter from "./routes/item.routes.js";
// import shopRouter from "./routes/shop.routes.js";
// import orderRouter from "./routes/order.routes.js";
// import { socketHandler } from "./socket.js";

// const app = express();
// const server = http.createServer(app);

// /* ✅ ALLOWED ORIGINS */
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://cravecartt.onrender.com"
// ];

// /* ✅ EXPRESS CORS */
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"]
//   })
// );

// app.use(express.json());
// app.use(cookieParser());

// /* ✅ SOCKET.IO CORS */
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST"]
//   }
// });

// app.set("io", io);

// /* ROUTES */
// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);
// app.use("/api/shop", shopRouter);
// app.use("/api/item", itemRouter);
// app.use("/api/order", orderRouter);

// /* SOCKET HANDLER */
// socketHandler(io);

// /* SERVER */
// const PORT = process.env.PORT || 8000;
// server.listen(PORT, () => {
//   connectDb();
//   console.log(`🚀 Server running on port ${PORT}`);
// });
