import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  withCredentials: true
});

socket.on("connect", () =>
  console.log("Socket connected:", socket.id)
);

export default socket;




// import { io } from "socket.io-client";

// // Single Socket.IO instance for the app
// export const socket = io("http://localhost:8000");

// // Optional: log socket connection status
// socket.on("connect", () => console.log("Socket connected:", socket.id));
// socket.on("disconnect", () => console.log("Socket disconnected"));
