import axios from 'axios'
import React, { useState } from 'react'
import { MdPhone } from "react-icons/md"
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { updateOrderStatus } from '../redux/userSlice'

function OwnerOrderCard({ data }) {
  const dispatch = useDispatch()
  const [availableBoys, setAvailableBoys] = useState([])

  // ✅ owner gets ONLY ONE shopOrder from backend
  const shopOrder = data?.shopOrders

  /* 🛑 HARD GUARD */
  if (!shopOrder) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-500 text-sm">Loading order details…</p>
      </div>
    )
  }

  const handleUpdateStatus = async (orderId, shopId, status) => {
    if (!status) return
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      )

      dispatch(updateOrderStatus({ orderId, shopId, status }))
      setAvailableBoys(res.data?.availableBoys || [])
    } catch (error) {
      console.log("Update status error:", error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">

      {/* USER INFO */}
      <div>
        <h2 className="text-lg font-semibold">{data.user?.fullName}</h2>
        <p className="text-sm text-gray-500">{data.user?.email}</p>
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <MdPhone /> {data.user?.mobile}
        </p>
        <p className="text-sm text-gray-600">
          Payment: {data.paymentMethod === "online"
            ? (data.payment ? "Paid" : "Pending")
            : data.paymentMethod}
        </p>
      </div>

      {/* ADDRESS */}
      <div className="text-sm text-gray-600">
        <p>{data.deliveryAddress?.text}</p>
        <p className="text-xs text-gray-500">
          Lat: {data.deliveryAddress?.latitude},
          Lon: {data.deliveryAddress?.longitude}
        </p>
      </div>

      {/* ITEMS */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {shopOrder.shopOrderItems?.length > 0 ? (
          shopOrder.shopOrderItems.map((item, index) => (
            <div key={index} className="w-40 border rounded-lg p-2">
              <img
                src={item?.item?.image}
                alt=""
                className="w-full h-24 object-cover rounded"
              />
              <p className="text-sm font-semibold">{item?.name}</p>
              <p className="text-xs text-gray-500">
                Qty: {item?.quantity} × ₹{item?.price}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No items found</p>
        )}
      </div>

      {/* STATUS */}
      <div className="flex justify-between items-center border-t pt-3">
        <span className="text-sm">
          Status:
          <span className="ml-1 font-semibold capitalize text-[#ff4d2d]">
            {shopOrder.status}
          </span>
        </span>

        <select
          className="border px-3 py-1 roundedд rounded-md text-sm text-[#ff4d2d] border-[#ff4d2d]"
          onChange={(e) =>
            handleUpdateStatus(data._id, shopOrder.shop?._id, e.target.value)
          }
        >
          <option value="">Change</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out of delivery">Out of Delivery</option>
        </select>
      </div>

      {/* DELIVERY BOY */}
      {shopOrder.status === "out of delivery" && (
        <div className="p-2 bg-orange-50 rounded-lg text-sm">
          {shopOrder.assignedDeliveryBoy ? (
            <p>
              Assigned: {shopOrder.assignedDeliveryBoy.fullName} –{" "}
              {shopOrder.assignedDeliveryBoy.mobile}
            </p>
          ) : availableBoys.length > 0 ? (
            availableBoys.map((b, i) => (
              <p key={i}>{b.fullName} – {b.mobile}</p>
            ))
          ) : (
            <p>Waiting for delivery boy to accept</p>
          )}
        </div>
      )}

      {/* TOTAL */}
      <div className="text-right font-bold text-sm">
        Total: ₹{shopOrder.subtotal}
      </div>

    </div>
  )
}

export default OwnerOrderCard

// import axios from 'axios'
// import React, { useState } from 'react'
// import { MdPhone } from "react-icons/md"
// import { serverUrl } from '../App'
// import { useDispatch } from 'react-redux'
// import { updateOrderStatus } from '../redux/userSlice'

// function OwnerOrderCard({ data }) {
//   const dispatch = useDispatch()
//   const [availableBoys, setAvailableBoys] = useState([])

//   const shopOrder = data?.shopOrders   // ✅ single source

//   const handleUpdateStatus = async (orderId, shopId, status) => {
//     if (!status) return
//     try {
//       const result = await axios.post(
//         `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
//         { status },
//         { withCredentials: true }
//       )
//       dispatch(updateOrderStatus({ orderId, shopId, status }))
//       setAvailableBoys(result.data?.availableBoys || [])
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   // ✅ HARD GUARD (prevents crash)
//   if (!shopOrder) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow">
//         <p className="text-gray-500 text-sm">Loading order details…</p>
//       </div>
//     )
//   }

//   return (
//     <div className='bg-white rounded-lg shadow p-4 space-y-4'>

//       {/* USER INFO */}
//       <div>
//         <h2 className='text-lg font-semibold text-gray-800'>{data.user?.fullName}</h2>
//         <p className='text-sm text-gray-500'>{data.user?.email}</p>
//         <p className='flex items-center gap-2 text-sm text-gray-600 mt-1'>
//           <MdPhone /> <span>{data.user?.mobile}</span>
//         </p>
//         <p className='text-sm text-gray-600'>
//           Payment: {data.paymentMethod === "online" ? (data.payment ? "Paid" : "Pending") : data.paymentMethod}
//         </p>
//       </div>

//       {/* ADDRESS */}
//       <div className='text-sm text-gray-600'>
//         <p>{data.deliveryAddress?.text}</p>
//         <p className='text-xs text-gray-500'>
//           Lat: {data.deliveryAddress?.latitude}, Lon: {data.deliveryAddress?.longitude}
//         </p>
//       </div>

//       {/* ITEMS */}
//       <div className='flex space-x-4 overflow-x-auto pb-2'>
//         {shopOrder.shopOrderItems?.length > 0 ? (
//           shopOrder.shopOrderItems.map((item, index) => (
//             <div key={index} className='flex-shrink-0 w-40 border rounded-lg p-2'>
//               <img
//                 src={item?.item?.image}
//                 alt=""
//                 className='w-full h-24 object-cover rounded'
//               />
//               <p className='text-sm font-semibold mt-1'>{item?.name}</p>
//               <p className='text-xs text-gray-500'>
//                 Qty: {item?.quantity} × ₹{item?.price}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500 text-sm">No items found</p>
//         )}
//       </div>

//       {/* STATUS */}
//       <div className='flex justify-between items-center pt-3 border-t'>
//         <span className='text-sm'>
//           Status:
//           <span className='ml-1 font-semibold capitalize text-[#ff4d2d]'>
//             {shopOrder.status}
//           </span>
//         </span>

//         <select
//           className='rounded-md border px-3 py-1 text-sm border-[#ff4d2d] text-[#ff4d2d]'
//           onChange={(e) =>
//             handleUpdateStatus(data._id, shopOrder.shop?._id, e.target.value)
//           }
//         >
//           <option value="">Change</option>
//           <option value="pending">Pending</option>
//           <option value="preparing">Preparing</option>
//           <option value="out of delivery">Out of Delivery</option>
//         </select>
//       </div>

//       {/* DELIVERY BOY */}
//       {shopOrder.status === "out of delivery" && (
//         <div className='mt-3 p-2 border rounded-lg text-sm bg-orange-50'>
//           {shopOrder.assignedDeliveryBoy ? (
//             <p>
//               Assigned: {shopOrder.assignedDeliveryBoy.fullName} – {shopOrder.assignedDeliveryBoy.mobile}
//             </p>
//           ) : availableBoys.length > 0 ? (
//             availableBoys.map((b, i) => (
//               <p key={i}>{b.fullName} – {b.mobile}</p>
//             ))
//           ) : (
//             <p>Waiting for delivery boy to accept</p>
//           )}
//         </div>
//       )}

//       {/* TOTAL */}
//       <div className='text-right font-bold text-sm'>
//         Total: ₹{shopOrder.subtotal}
//       </div>

//     </div>
//   )
// }

// export default OwnerOrderCard
