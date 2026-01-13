import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  withCredentials: true,
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

export default socket; // ✅ THIS LINE IS REQUIRED



// import { io } from "socket.io-client";

// // Single Socket.IO instance for the app
// export const socket = io("http://localhost:8000");

// // Optional: log socket connection status
// socket.on("connect", () => console.log("Socket connected:", socket.id));
// socket.on("disconnect", () => console.log("Socket disconnected"));
