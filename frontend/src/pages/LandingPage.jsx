import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUtensils,
  FaMotorcycle,
  FaStore,
  FaLock,
  FaRoute,
  FaUsers
} from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* ================= HEADER ================= */}
      <header className="flex justify-between items-center px-10 py-6 border-b">
        <h1 className="text-2xl font-extrabold text-[#ff4d2d]">
          CraveCart
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/signin")}
            className="px-4 py-2 text-gray-600 hover:text-black"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-[#ff4d2d] text-white px-6 py-2 rounded-md hover:bg-[#e64526]"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* ================= HERO SPLIT ================= */}
      <section className="grid md:grid-cols-2 gap-10 px-10 py-24 max-w-7xl mx-auto">
        <div>
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Smart Food Delivery <br />
            <span className="text-[#ff4d2d]">For Smart Cities</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            CraveCart is a full-stack food delivery ecosystem connecting
            customers, restaurants, and delivery partners with real-time
            tracking and secure OTP delivery.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-[#ff4d2d] text-white px-8 py-3 rounded-md text-lg"
            >
              Join Now
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="border px-8 py-3 rounded-md text-lg hover:bg-gray-50"
            >
              Login
            </button>
          </div>
        </div>

        {/* RIGHT VISUAL BLOCK */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#fff3ee] p-6 rounded-xl">
            <FaUtensils className="text-3xl text-[#ff4d2d] mb-3" />
            <p className="font-semibold">Food Ordering</p>
          </div>
          <div className="bg-[#eef6ff] p-6 rounded-xl">
            <FaMotorcycle className="text-3xl text-blue-500 mb-3" />
            <p className="font-semibold">Live Delivery</p>
          </div>
          <div className="bg-[#f1fff4] p-6 rounded-xl">
            <FaStore className="text-3xl text-green-500 mb-3" />
            <p className="font-semibold">Local Shops</p>
          </div>
          <div className="bg-[#fdf4ff] p-6 rounded-xl">
            <FaLock className="text-3xl text-purple-500 mb-3" />
            <p className="font-semibold">OTP Security</p>
          </div>
        </div>
      </section>

      {/* ================= PLATFORM BENEFITS ================= */}
      <section className="bg-gray-50 py-20 px-10">
        <h3 className="text-3xl font-bold text-center mb-14">
          Why CraveCart?
        </h3>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <FaRoute className="text-4xl text-orange-500 mb-4" />
            <h4 className="font-semibold text-xl mb-2">
              Intelligent Routing
            </h4>
            <p className="text-gray-600">
              Nearby delivery partners are matched instantly using live location.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <FaUsers className="text-4xl text-blue-500 mb-4" />
            <h4 className="font-semibold text-xl mb-2">
              Multi-Role Platform
            </h4>
            <p className="text-gray-600">
              Designed separately for customers, shop owners, and delivery agents.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <FaLock className="text-4xl text-green-500 mb-4" />
            <h4 className="font-semibold text-xl mb-2">
              Trusted Delivery
            </h4>
            <p className="text-gray-600">
              OTP-verified order completion ensures fraud-free delivery.
            </p>
          </div>
        </div>
      </section>

      {/* ================= ROLES SECTION ================= */}
      <section className="py-20 px-10 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">
          One Platform. Three Experiences.
        </h3>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="border rounded-xl p-6">
            <h4 className="font-bold text-[#ff4d2d] mb-2">Customers</h4>
            <p className="text-gray-600">
              Browse food, place orders, track delivery in real time.
            </p>
          </div>
          <div className="border rounded-xl p-6">
            <h4 className="font-bold text-blue-500 mb-2">Restaurant Owners</h4>
            <p className="text-gray-600">
              Manage menus, orders, and delivery assignments easily.
            </p>
          </div>
          <div className="border rounded-xl p-6">
            <h4 className="font-bold text-green-500 mb-2">Delivery Partners</h4>
            <p className="text-gray-600">
              Accept nearby orders and track earnings transparently.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-[#ff4d2d] text-white py-20 px-10 text-center">
        <h3 className="text-4xl font-bold mb-4">
          Build Smarter Deliveries with CraveCart
        </h3>
        <p className="mb-8 text-lg">
          Whether you order, sell, or deliver — CraveCart is built for you.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-[#ff4d2d] px-10 py-3 rounded-md font-semibold hover:bg-gray-100"
        >
          Create Your Account
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center py-6 text-gray-500 border-t">
        © {new Date().getFullYear()} CraveCart • Food Delivery Platform
      </footer>
    </div>
  );
};

export default LandingPage;


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaRocket,
//   FaStore,
//   FaMotorcycle,
//   FaShieldAlt,
//   FaMapMarkedAlt,
//   FaMobileAlt
// } from "react-icons/fa";

// const LandingPage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-white text-gray-800">

//       {/* ================= NAVBAR ================= */}
//       <header className="flex justify-between items-center px-8 py-5 shadow-sm">
//         <h1 className="text-2xl font-extrabold text-[#ff4d2d] tracking-wide">
//           CraveCart
//         </h1>
//         <div className="space-x-4">
//           <button
//             onClick={() => navigate("/signin")}
//             className="text-gray-600 hover:text-[#ff4d2d]"
//           >
//             Sign In
//           </button>
//           <button
//             onClick={() => navigate("/signup")}
//             className="bg-[#ff4d2d] text-white px-5 py-2 rounded-lg hover:bg-[#e63e21]"
//           >
//             Get Started
//           </button>
//         </div>
//       </header>

//       {/* ================= HERO ================= */}
//       <section className="bg-gradient-to-r from-[#ff4d2d] to-[#ff784f] text-white px-10 py-24">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          
//           <div>
//             <h2 className="text-5xl font-extrabold leading-tight mb-6">
//               Food Delivery <br /> Built for Speed & Trust
//             </h2>
//             <p className="text-lg opacity-90 mb-8">
//               CraveCart is a modern food delivery platform connecting customers,
//               restaurants, and delivery partners with real-time tracking and
//               OTP-verified delivery.
//             </p>
//             <button
//               onClick={() => navigate("/signup")}
//               className="bg-white text-[#ff4d2d] px-8 py-3 rounded-full font-semibold hover:bg-gray-100"
//             >
//               Join CraveCart
//             </button>
//           </div>

//           <div className="hidden md:flex justify-center">
//             <FaRocket className="text-[180px] opacity-20" />
//           </div>
//         </div>
//       </section>

//       {/* ================= FEATURES ================= */}
//       <section className="py-20 px-8 bg-[#fff9f6]">
//         <h3 className="text-3xl font-bold text-center mb-14">
//           One Platform. <span className="text-[#ff4d2d]">Three Roles.</span>
//         </h3>

//         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          
//           <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
//             <FaStore className="text-5xl mx-auto mb-4 text-indigo-500" />
//             <h4 className="text-xl font-semibold mb-3">For Restaurants</h4>
//             <p className="text-gray-600">
//               Manage orders, update status, and grow your business with live
//               order tracking.
//             </p>
//           </div>

//           <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
//             <FaMotorcycle className="text-5xl mx-auto mb-4 text-green-500" />
//             <h4 className="text-xl font-semibold mb-3">For Delivery Partners</h4>
//             <p className="text-gray-600">
//               Smart order matching, route tracking, OTP delivery & earnings
//               dashboard.
//             </p>
//           </div>

//           <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
//             <FaMobileAlt className="text-5xl mx-auto mb-4 text-orange-500" />
//             <h4 className="text-xl font-semibold mb-3">For Customers</h4>
//             <p className="text-gray-600">
//               Browse nearby shops, track orders live, and enjoy secure delivery.
//             </p>
//           </div>

//         </div>
//       </section>

//       {/* ================= WHY TRUST ================= */}
//       <section className="py-20 px-8">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          
//           <div>
//             <h3 className="text-3xl font-bold mb-6">
//               Built with Security & Transparency
//             </h3>
//             <ul className="space-y-4">
//               <li className="flex items-center gap-3">
//                 <FaShieldAlt className="text-green-600 text-xl" />
//                 OTP-based delivery confirmation
//               </li>
//               <li className="flex items-center gap-3">
//                 <FaMapMarkedAlt className="text-blue-600 text-xl" />
//                 Live delivery location tracking
//               </li>
//               <li className="flex items-center gap-3">
//                 <FaRocket className="text-orange-500 text-xl" />
//                 Fast & optimized order assignment
//               </li>
//             </ul>
//           </div>

//           <div className="bg-[#fff3ee] p-10 rounded-xl">
//             <h4 className="text-xl font-semibold mb-4 text-[#ff4d2d]">
//               Why CraveCart?
//             </h4>
//             <p className="text-gray-700">
//               Unlike traditional food apps, CraveCart focuses on transparency,
//               fairness for delivery partners, and real-time communication
//               between all parties.
//             </p>
//           </div>

//         </div>
//       </section>

//       {/* ================= CTA ================= */}
//       <section className="bg-[#ff4d2d] text-white text-center py-20 px-8">
//         <h3 className="text-4xl font-extrabold mb-6">
//           Start Your Journey With CraveCart
//         </h3>
//         <p className="text-lg mb-8 opacity-90">
//           Sign up today as a customer, shop owner, or delivery partner.
//         </p>
//         <button
//           onClick={() => navigate("/signup")}
//           className="bg-white text-[#ff4d2d] px-10 py-3 rounded-full font-bold hover:bg-gray-100"
//         >
//           Create Free Account
//         </button>
//       </section>

//       {/* ================= FOOTER ================= */}
//       <footer className="text-center py-6 text-gray-500">
//         © {new Date().getFullYear()} CraveCart • Built with ❤️
//       </footer>

//     </div>
//   );
// };

// export default LandingPage;
