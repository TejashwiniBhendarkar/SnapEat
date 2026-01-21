import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import LandingPage from "./pages/LandingPage"; // ✅ NEW
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import CartPage from "./pages/CartPage";
import CheckOut from "./pages/CheckOut";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";
import TrackOrderPage from "./pages/TrackOrderPage";
import Shop from "./pages/Shop";

import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetCity from "./hooks/useGetCity";
import useGetMyshop from "./hooks/useGetMyShop";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import useGetMyOrders from "./hooks/useGetMyOrders";
import useUpdateLocation from "./hooks/useUpdateLocation";

import socket from "./socket";

export const serverUrl = "http://localhost:8000";

function App() {
  const { userData } = useSelector(state => state.user);

  // 🔁 EXISTING HOOKS (UNCHANGED)
  useGetCurrentUser();
  useUpdateLocation();
  useGetCity();
  useGetMyshop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();

  // 🔌 SOCKET IDENTITY (UNCHANGED)
  useEffect(() => {
    if (userData?._id) {
      socket.emit("identity", { userId: userData._id });
    }
  }, [userData?._id]);

  return (
    <Routes>
      {/* 🌟 PUBLIC LANDING PAGE */}
      <Route
        path="/"
        element={!userData ? <LandingPage /> : <Navigate to="/home" />}
      />

      {/* 🔐 AUTH */}
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/home" />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/home" />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to="/home" />}
      />

      {/* 🏠 MAIN APP */}
      <Route
        path="/home"
        element={userData ? <Home /> : <Navigate to="/signin" />}
      />

      <Route
        path="/create-edit-shop"
        element={userData ? <CreateEditShop /> : <Navigate to="/signin" />}
      />
      <Route
        path="/add-item"
        element={userData ? <AddItem /> : <Navigate to="/signin" />}
      />
      <Route
        path="/edit-item/:itemId"
        element={userData ? <EditItem /> : <Navigate to="/signin" />}
      />

      <Route
        path="/cart"
        element={userData ? <CartPage /> : <Navigate to="/signin" />}
      />
      <Route
        path="/checkout"
        element={userData ? <CheckOut /> : <Navigate to="/signin" />}
      />
      <Route
        path="/order-placed"
        element={userData ? <OrderPlaced /> : <Navigate to="/signin" />}
      />
      <Route
        path="/my-orders"
        element={userData ? <MyOrders /> : <Navigate to="/signin" />}
      />
      <Route
        path="/track-order/:orderId"
        element={userData ? <TrackOrderPage /> : <Navigate to="/signin" />}
      />
      <Route
        path="/shop/:shopId"
        element={userData ? <Shop /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
}

export default App;

// import React, { useEffect } from "react";
// import { Navigate, Route, Routes } from "react-router-dom";
// import { useSelector } from "react-redux";

// import SignUp from "./pages/SignUp";
// import SignIn from "./pages/SignIn";
// import ForgotPassword from "./pages/ForgotPassword";
// import Home from "./pages/Home";
// import CreateEditShop from "./pages/CreateEditShop";
// import AddItem from "./pages/AddItem";
// import EditItem from "./pages/EditItem";
// import CartPage from "./pages/CartPage";
// import CheckOut from "./pages/CheckOut";
// import OrderPlaced from "./pages/OrderPlaced";
// import MyOrders from "./pages/MyOrders";
// import TrackOrderPage from "./pages/TrackOrderPage";
// import Shop from "./pages/Shop";

// import useGetCurrentUser from "./hooks/useGetCurrentUser";
// import useGetCity from "./hooks/useGetCity";
// import useGetMyshop from "./hooks/useGetMyShop";
// import useGetShopByCity from "./hooks/useGetShopByCity";
// import useGetItemsByCity from "./hooks/useGetItemsByCity";
// import useGetMyOrders from "./hooks/useGetMyOrders";
// import useUpdateLocation from "./hooks/useUpdateLocation";

// import socket from "./socket";
// // ✅ CORRECT IMPORT

// export const serverUrl = "http://localhost:8000";

// function App() {
//   const { userData } = useSelector(state => state.user);

//   useGetCurrentUser();
//   useUpdateLocation();
//   useGetCity();
//   useGetMyshop();
//   useGetShopByCity();
//   useGetItemsByCity();
//   useGetMyOrders();

//   // ✅ REGISTER USER WITH SOCKET
//  useEffect(() => {
//   if (userData?._id) {
//     socket.emit("identity", { userId: userData._id });
//   }
// }, [userData?._id]);

//   return (
//     <Routes>
//       <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
//       <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
//       <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />

//       <Route path="/" element={userData ? <Home /> : <Navigate to="/signin" />} />

//       <Route path="/create-edit-shop" element={userData ? <CreateEditShop /> : <Navigate to="/signin" />} />
//       <Route path="/add-item" element={userData ? <AddItem /> : <Navigate to="/signin" />} />
//       <Route path="/edit-item/:itemId" element={userData ? <EditItem /> : <Navigate to="/signin" />} />

//       <Route path="/cart" element={userData ? <CartPage /> : <Navigate to="/signin" />} />
//       <Route path="/checkout" element={userData ? <CheckOut /> : <Navigate to="/signin" />} />
//       <Route path="/order-placed" element={userData ? <OrderPlaced /> : <Navigate to="/signin" />} />
//       <Route path="/my-orders" element={userData ? <MyOrders /> : <Navigate to="/signin" />} />
//       <Route path="/track-order/:orderId" element={userData ? <TrackOrderPage /> : <Navigate to="/signin" />} />
//       <Route path="/shop/:shopId" element={userData ? <Shop /> : <Navigate to="/signin" />} />
//     </Routes>
//   );
// }

// export default App;
