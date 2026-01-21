import React from 'react'
import Nav from './NaV.JSX'
import { useSelector } from 'react-redux'
import { FaUtensils, FaPen } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import OwnerItemCard from './OwnerItemCard.jsx';

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Nav />

      {/* ================= NO SHOP ================= */}
      {!myShopData && (
        <div className="w-full px-6 py-24">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-12 flex flex-col md:flex-row items-center gap-10">
            <FaUtensils className="text-[#ff4d2d] text-8xl" />
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                Open Your Restaurant on CraveCart
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-xl">
                Reach nearby customers, manage orders easily, and grow your food business online.
              </p>
              <button
                onClick={() => navigate("/create-edit-shop")}
                className="bg-[#ff4d2d] text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-orange-600 transition"
              >
                Create Restaurant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DASHBOARD ================= */}
      {myShopData && (
        <div className="w-full">

          {/* ================= HERO HEADER ================= */}
          <div className="bg-gradient-to-r from-[#ff4d2d] to-orange-500">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-white">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">
                  {myShopData.name}
                </h1>
                <p className="text-white/90 mt-2 text-lg">
                  {myShopData.city}, {myShopData.state}
                </p>
              </div>

              <button
                onClick={() => navigate("/create-edit-shop")}
                className="flex items-center gap-2 bg-white text-[#ff4d2d] px-6 py-3 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
              >
                <FaPen /> Edit Restaurant
              </button>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="max-w-7xl mx-auto px-6 py-14 space-y-14">

            {/* ================= DETAILS SECTION ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* DETAILS CARD */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Restaurant Details
                </h2>

                <div className="space-y-5 text-gray-700 text-lg">
                  <p>
                    <span className="font-semibold text-gray-900">Address</span><br />
                    {myShopData.address}
                  </p>

                  <p>
                    <span className="font-semibold text-gray-900">Location</span><br />
                    {myShopData.city}, {myShopData.state}
                  </p>
                </div>
              </div>

              {/* IMAGE CARD */}
              <div className="bg-white rounded-3xl shadow-md overflow-hidden flex items-center justify-center p-6">
                <img
                  src={myShopData.image}
                  alt={myShopData.name}
                  className="max-h-64 object-contain"
                />
              </div>
            </div>

            {/* ================= MENU SECTION ================= */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Your Menu
                </h2>
                <button
                  onClick={() => navigate("/add-item")}
                  className="bg-[#ff4d2d] text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
                >
                  Add Item
                </button>
              </div>

              {/* EMPTY STATE */}
              {myShopData.items.length === 0 && (
                <div className="bg-white rounded-3xl shadow-md p-14 text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    No food items added yet
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Add delicious items to your menu and start receiving orders.
                  </p>
                  <button
                    onClick={() => navigate("/add-item")}
                    className="bg-[#ff4d2d] text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
                  >
                    Add Food Item
                  </button>
                </div>
              )}

              {/* ITEMS LIST */}
              {myShopData.items.length > 0 && (
                <div className="space-y-5">
                  {myShopData.items.map((item, index) => (
                    <OwnerItemCard data={item} key={index} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default OwnerDashboard


// import React from 'react'
// import Nav from './NaV.JSX'
// import { useSelector } from 'react-redux'
// import { FaUtensils } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';
// import { FaPen } from "react-icons/fa";
// import OwnerItemCard from './OwnerItemCard.jsx';
// function OwnerDashboard() {
//   const { myShopData } = useSelector(state => state.owner)
//   const navigate = useNavigate()

  
//   return (
//     <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center'>
//       <Nav />
//       {!myShopData &&
//         <div className='flex justify-center items-center p-4 sm:p-6'>
//           <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
//             <div className='flex flex-col items-center text-center'>
//               <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4' />
//               <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>Add Your Restaurant</h2>
//               <p className='text-gray-600 mb-4 text-sm sm:text-base'>Join our food delivery platform and reach thousands of hungry customers every day.
//               </p>
//               <button className='bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200' onClick={() => navigate("/create-edit-shop")}>
//                 Get Started
//               </button>
//             </div>
//           </div>
//         </div>
//       }

//       {myShopData &&
//         <div className='w-full flex flex-col items-center gap-6 px-4 sm:px-6'>
//           <h1 className='text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center'><FaUtensils className='text-[#ff4d2d] w-14 h-14 ' />Welcome to {myShopData.name}</h1>

//           <div className='bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative'>
//             <div className='absolute top-4 right-4 bg-[#ff4d2d] text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-colors cursor-pointer' onClick={()=>navigate("/create-edit-shop")}>
// <FaPen size={20}/>
//             </div>
//              <img src={myShopData.image} alt={myShopData.name} className='w-full h-48 sm:h-64 object-cover'/>
//              <div className='p-4 sm:p-6'>
//               <h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>{myShopData.name}</h1>
//               <p className='text-gray-500 '>{myShopData.city},{myShopData.state}</p>
//               <p className='text-gray-500 mb-4'>{myShopData.address}</p>
//             </div>
//           </div>

//           {myShopData.items.length==0 && 
//             <div className='flex justify-center items-center p-4 sm:p-6'>
//           <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
//             <div className='flex flex-col items-center text-center'>
//               <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4' />
//               <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>Add Your Food Item</h2>
//               <p className='text-gray-600 mb-4 text-sm sm:text-base'>Share your delicious creations with our customers by adding them to the menu.
//               </p>
//               <button className='bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200' onClick={() => navigate("/add-item")}>
//               Add Food
//               </button>
//             </div>
//           </div>
//         </div>
//             }

//             {myShopData.items.length>0 && <div className='flex flex-col items-center gap-4 w-full max-w-3xl '>
//               {myShopData.items.map((item,index)=>(
//                 <OwnerItemCard data={item} key={index}/>
//               ))}
//               </div>}
            
//         </div>}



//     </div>
//   )
// }

// export default OwnerDashboard
