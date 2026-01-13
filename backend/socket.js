import User from "./models/user.model.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("identity", async ({ userId }) => {
      await User.findByIdAndUpdate(userId, {
        socketId: socket.id,
        isOnline: true
      });
    });

    socket.on("updateLocation", async ({ latitude, longitude, userId }) => {
      await User.findByIdAndUpdate(userId, {
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        socketId: socket.id,
        isOnline: true
      });
    });

    socket.on("disconnect", async () => {
      await User.findOneAndUpdate(
        { socketId: socket.id },
        { socketId: null, isOnline: false }
      );
    });
  });
};

// import User from "./models/user.model.js";

// export const socketHandler = (io) => {
//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     /* =============================
//        REGISTER USER (VERY IMPORTANT)
//     ============================== */
//     socket.on("identity", async ({ userId }) => {
//       try {
//         await User.findByIdAndUpdate(userId, {
//           socketId: socket.id,
//           isOnline: true
//         });
//       } catch (error) {
//         console.log("identity error:", error);
//       }
//     });

//     /* =============================
//        UPDATE DELIVERY BOY LOCATION
//     ============================== */
//     socket.on("updateLocation", async ({ latitude, longitude, userId }) => {
//       try {
//         const user = await User.findByIdAndUpdate(userId, {
//           location: {
//             type: "Point",
//             coordinates: [longitude, latitude]
//           },
//           socketId: socket.id,
//           isOnline: true
//         });

//         if (user) {
//           io.emit("updateDeliveryLocation", {
//             deliveryBoyId: userId,
//             latitude,
//             longitude
//           });
//         }
//       } catch (error) {
//         console.log("updateLocation error:", error);
//       }
//     });

//     /* =============================
//        DISCONNECT
//     ============================== */
//     socket.on("disconnect", async () => {
//       try {
//         await User.findOneAndUpdate(
//           { socketId: socket.id },
//           { socketId: null, isOnline: false }
//         );
//         console.log("Socket disconnected:", socket.id);
//       } catch (error) {
//         console.log("disconnect error:", error);
//       }
//     });
//   });
// };