import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import { ClipLoader } from "react-spinners";

function DeliveryBoy() {
  const { userData, socket } = useSelector(state => state.user);

  const [currentOrder, setCurrentOrder] = useState(null);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);

  // ✅ SEPARATE LOADING STATES (CRITICAL)
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [message, setMessage] = useState("");

  /* =========================
     💰 EARNINGS
  ========================= */
  const ratePerDelivery = 50;
  const [completedDeliveries, setCompletedDeliveries] = useState(() => {
    return Number(localStorage.getItem("completedDeliveries")) || 0;
  });
  const totalEarning = completedDeliveries * ratePerDelivery;

  /* =========================
     📍 LIVE LOCATION
  ========================= */
  useEffect(() => {
    if (!socket || !userData || userData.role !== "deliveryBoy") return;

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setDeliveryBoyLocation({ lat, lon });

        socket.emit("updateLocation", {
          latitude: lat,
          longitude: lon,
          userId: userData._id
        });
      },
      err => console.log(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [socket, userData]);

  /* =========================
     📦 SOCKET
  ========================= */
  useEffect(() => {
    if (!socket) return;
    socket.on("newAssignment", getAssignments);
    return () => socket.off("newAssignment", getAssignments);
  }, [socket]);

  /* =========================
     📡 API CALLS
  ========================= */
  const getAssignments = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/order/get-assignments`,
        { withCredentials: true }
      );
      setAvailableAssignments(res.data || []);
    } catch {
      setAvailableAssignments([]);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        { withCredentials: true }
      );
      setCurrentOrder(res.data);
    } catch {
      setCurrentOrder(null);
    }
  };

  const acceptOrder = async id => {
    try {
      await axios.get(
        `${serverUrl}/api/order/accept-order/${id}`,
        { withCredentials: true }
      );
      getAssignments();
      getCurrentOrder();
    } catch {
      alert("Failed to accept order");
    }
  };

  /* =========================
     📩 SEND OTP (FIXED)
  ========================= */
  const sendOtp = async () => {
    if (!currentOrder || !currentOrder.shopOrders?.length) {
      alert("Invalid order data");
      return;
    }

    setSendingOtp(true);
    try {
      await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrders[0]._id // ✅ CORRECT ID
        },
        { withCredentials: true }
      );
      setShowOtpBox(true);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  /* =========================
     ✅ VERIFY OTP (FIXED)
  ========================= */
  const verifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrders[0]._id, // ✅ CORRECT ID
          otp
        },
        { withCredentials: true }
      );

      setMessage(res.data.message);

      setCompletedDeliveries(prev => {
        const next = prev + 1;
        localStorage.setItem("completedDeliveries", next);
        return next;
      });

      setTimeout(() => {
        setCurrentOrder(null);
        setShowOtpBox(false);
        setOtp("");
        setMessage("");
        getAssignments();
      }, 1200);

    } catch (err) {
      alert(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  };

  useEffect(() => {
    if (!userData || userData.role !== "deliveryBoy") return;
    getAssignments();
    getCurrentOrder();
  }, [userData]);

  if (!userData || userData.role !== "deliveryBoy") {
    return <div className="p-6 text-center">Unauthorized</div>;
  }

  return (
    <div className="min-h-screen w-full bg-[#fff9f6]">
      <Nav />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {!currentOrder && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Available Orders</h2>

            {availableAssignments.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-400">
                No orders near you right now
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {availableAssignments.map((a, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow">
                    <p className="font-semibold text-lg">{a.shopName}</p>

                    <button
                      onClick={() => acceptOrder(a.assignmentId)}
                      className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
                    >
                      Accept Order
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {currentOrder && (
          <section className="bg-white rounded-3xl shadow p-6 space-y-4">
            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation:
                  deliveryBoyLocation || {
                    lat: userData.location.coordinates[1],
                    lon: userData.location.coordinates[0]
                  },
                customerLocation: {
                  lat: currentOrder.deliveryAddress.latitude,
                  lon: currentOrder.deliveryAddress.longitude
                }
              }}
            />

            {!showOtpBox ? (
              <button
                onClick={sendOtp}
                disabled={sendingOtp}
                className="w-full bg-green-500 text-white py-4 rounded-2xl text-lg font-semibold"
              >
                {sendingOtp ? <ClipLoader size={20} color="white" /> : "Mark as Delivered"}
              </button>
            ) : (
              <div>
                <input
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter delivery OTP"
                  className="w-full border p-4 rounded-xl mb-3 text-center text-lg tracking-widest"
                />

                {message && (
                  <p className="text-green-600 text-center mb-2">{message}</p>
                )}

                <button
                  onClick={verifyOtp}
                  disabled={verifyingOtp}
                  className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold"
                >
                  {verifyingOtp ? <ClipLoader size={20} color="white" /> : "Confirm Delivery"}
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default DeliveryBoy;

// import React, { useEffect, useState } from "react";
// import Nav from "./Nav";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { serverUrl } from "../App";
// import DeliveryBoyTracking from "./DeliveryBoyTracking";
// import { ClipLoader } from "react-spinners";

// function DeliveryBoy() {
//   const { userData, socket } = useSelector(state => state.user);

//   const [currentOrder, setCurrentOrder] = useState(null);
//   const [availableAssignments, setAvailableAssignments] = useState([]);
//   const [showOtpBox, setShowOtpBox] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   /* =========================
//      💰 EARNINGS (LOCAL ONLY)
//   ========================= */
//   const ratePerDelivery = 50;
//   const [completedDeliveries, setCompletedDeliveries] = useState(() => {
//     return Number(localStorage.getItem("completedDeliveries")) || 0;
//   });
//   const totalEarning = completedDeliveries * ratePerDelivery;

//   /* =========================
//      📍 LIVE LOCATION
//   ========================= */
//   useEffect(() => {
//     if (!socket || !userData || userData.role !== "deliveryBoy") return;

//     const watchId = navigator.geolocation.watchPosition(
//       pos => {
//         const lat = pos.coords.latitude;
//         const lon = pos.coords.longitude;
//         setDeliveryBoyLocation({ lat, lon });

//         socket.emit("updateLocation", {
//           latitude: lat,
//           longitude: lon,
//           userId: userData._id
//         });
//       },
//       err => console.log(err),
//       { enableHighAccuracy: true }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, [socket, userData]);

//   /* =========================
//      📦 SOCKET
//   ========================= */
//   useEffect(() => {
//     if (!socket) return;
//     socket.on("newAssignment", getAssignments);
//     return () => socket.off("newAssignment", getAssignments);
//   }, [socket]);

//   /* =========================
//      📡 API
//   ========================= */
//   const getAssignments = async () => {
//     try {
//       const res = await axios.get(
//         `${serverUrl}/api/order/get-assignments`,
//         { withCredentials: true }
//       );
//       setAvailableAssignments(res.data || []);
//     } catch {
//       setAvailableAssignments([]);
//     }
//   };

//   const getCurrentOrder = async () => {
//     try {
//       const res = await axios.get(
//         `${serverUrl}/api/order/get-current-order`,
//         { withCredentials: true }
//       );
//       setCurrentOrder(res.data);
//     } catch {
//       setCurrentOrder(null);
//     }
//   };

//   const acceptOrder = async id => {
//     await axios.get(
//       `${serverUrl}/api/order/accept-order/${id}`,
//       { withCredentials: true }
//     );
//     getAssignments();
//     getCurrentOrder();
//   };

//   const sendOtp = async () => {
//     setLoading(true);
//     await axios.post(
//       `${serverUrl}/api/order/send-delivery-otp`,
//       {
//         orderId: currentOrder._id,
//         shopOrderId: currentOrder.shopOrder._id
//       },
//       { withCredentials: true }
//     );
//     setShowOtpBox(true);
//     setLoading(false);
//   };

//   const verifyOtp = async () => {
//     const res = await axios.post(
//       `${serverUrl}/api/order/verify-delivery-otp`,
//       {
//         orderId: currentOrder._id,
//         shopOrderId: currentOrder.shopOrder._id,
//         otp
//       },
//       { withCredentials: true }
//     );

//     setMessage(res.data.message);

//     setCompletedDeliveries(prev => {
//       const next = prev + 1;
//       localStorage.setItem("completedDeliveries", next);
//       return next;
//     });

//     setTimeout(() => {
//       setCurrentOrder(null);
//       setShowOtpBox(false);
//       setOtp("");
//       getAssignments();
//     }, 1200);
//   };

//   useEffect(() => {
//     if (!userData || userData.role !== "deliveryBoy") return;
//     getAssignments();
//     getCurrentOrder();
//   }, [userData]);

//   if (!userData || userData.role !== "deliveryBoy") {
//     return <div className="p-6 text-center">Unauthorized</div>;
//   }

//   return (
//     <div className="min-h-screen w-full bg-[#fff9f6]">
//       <Nav />

//       {/* ================= HERO ================= */}
//       <div className="w-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-10">
//         <div className="max-w-6xl mx-auto text-white">
//           <h1 className="text-3xl font-bold">
//             Hi, {userData.fullName} 👋
//           </h1>
//           <p className="opacity-90 mt-1">
//             {currentOrder ? "Delivering an order" : "You are online & available"}
//           </p>

//           <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <StatCard label="Deliveries" value={completedDeliveries} />
//             <StatCard label="Earnings" value={`₹${totalEarning}`} />
//             <StatCard label="Status" value={currentOrder ? "Busy" : "Available"} />
//           </div>
//         </div>
//       </div>

//       {/* ================= CONTENT ================= */}
//       <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

//         {/* AVAILABLE ORDERS */}
//         {!currentOrder && (
//           <section>
//             <h2 className="text-xl font-semibold mb-4">Available Orders</h2>

//             {availableAssignments.length === 0 ? (
//               <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-400">
//                 No orders near you right now
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 gap-6">
//                 {availableAssignments.map((a, i) => (
//                   <div key={i} className="bg-white p-6 rounded-2xl shadow">
//                     <p className="font-semibold text-lg">{a.shopName}</p>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {a.deliveryAddress?.text}
//                     </p>

//                     <button
//                       onClick={() => acceptOrder(a.assignmentId)}
//                       className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
//                     >
//                       Accept Order
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>
//         )}

//         {/* CURRENT ORDER */}
//         {currentOrder && (
//           <section className="bg-white rounded-3xl shadow p-6 space-y-4">
//             <h2 className="text-xl font-semibold">Current Order</h2>

//             <DeliveryBoyTracking
//               data={{
//                 deliveryBoyLocation:
//                   deliveryBoyLocation || {
//                     lat: userData.location.coordinates[1],
//                     lon: userData.location.coordinates[0]
//                   },
//                 customerLocation: {
//                   lat: currentOrder.deliveryAddress.latitude,
//                   lon: currentOrder.deliveryAddress.longitude
//                 }
//               }}
//             />

//             {!showOtpBox ? (
//               <button
//                 onClick={sendOtp}
//                 disabled={loading}
//                 className="w-full bg-green-500 text-white py-4 rounded-2xl text-lg font-semibold"
//               >
//                 {loading ? <ClipLoader size={20} color="white" /> : "Mark as Delivered"}
//               </button>
//             ) : (
//               <div>
//                 <input
//                   value={otp}
//                   onChange={e => setOtp(e.target.value)}
//                   placeholder="Enter delivery OTP"
//                   className="w-full border p-4 rounded-xl mb-3 text-center text-lg tracking-widest"
//                 />

//                 {message && (
//                   <p className="text-green-600 text-center mb-2">
//                     {message}
//                   </p>
//                 )}

//                 <button
//                   onClick={verifyOtp}
//                   className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold"
//                 >
//                   Confirm Delivery
//                 </button>
//               </div>
//             )}
//           </section>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================= STAT CARD ================= */
// const StatCard = ({ label, value }) => (
//   <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center">
//     <p className="text-sm opacity-90">{label}</p>
//     <p className="text-2xl font-bold mt-1">{value}</p>
//   </div>
// );

// export default DeliveryBoy;


