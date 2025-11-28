import { io } from "socket.io-client";

// Single Socket.IO instance for the app
export const socket = io("http://localhost:8000");

// Optional: log socket connection status
socket.on("connect", () => console.log("Socket connected:", socket.id));
socket.on("disconnect", () => console.log("Socket disconnected"));
