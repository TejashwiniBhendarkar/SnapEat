import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

export default socket;

// import { io } from "socket.io-client";

// const socket = io("http://localhost:8000", {
//   withCredentials: true
// });

// socket.on("connect", () =>
//   console.log("Socket connected:", socket.id)
// );

// export default socket;

