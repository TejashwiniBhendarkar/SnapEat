import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io"
import { useNavigate } from 'react-router-dom'
import UserOrderCard from '../components/UserOrderCard'
import OwnerOrderCard from '../components/OwnerOrderCard'
import axios from 'axios'
import { serverUrl } from '../App'
import { setMyOrders } from '../redux/userSlice'

function MyOrders() {
  const { userData, myOrders } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userData) return   // ⛔ wait for login data

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/order/my-orders`,
          { withCredentials: true }
        )
        dispatch(setMyOrders(res.data || []))
      } catch (err) {
        console.log("Fetch orders error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userData, dispatch])

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4">
      <div className="w-full max-w-[800px] p-4">

        {/* HEADER */}
        <div className="flex items-center gap-5 mb-6">
          <div onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
          </div>
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading order details...
          </p>
        )}

        {/* NO ORDERS */}
        {!loading && myOrders.length === 0 && (
          <p className="text-center text-gray-500">
            No orders found
          </p>
        )}

        {/* ORDERS */}
        {!loading && myOrders.map((order, index) => (
          userData.role === "user" ? (
            <UserOrderCard key={index} data={order} />
          ) : userData.role === "owner" ? (
            <OwnerOrderCard key={index} data={order} />
          ) : null
        ))}

      </div>
    </div>
  )
}

export default MyOrders

// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { IoIosArrowRoundBack } from "react-icons/io"
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { serverUrl } from '../App'
// import UserOrderCard from '../components/UserOrderCard'
// import OwnerOrderCard from '../components/OwnerOrderCard'
// import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice'

// function MyOrders() {
//   const { userData, myOrders, socket } = useSelector(state => state.user)
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const [loading, setLoading] = useState(true)

//   /* ✅ Fetch orders on load */
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await axios.get(
//           `${serverUrl}/api/order/my-orders`,
//           { withCredentials: true }
//         )
//         dispatch(setMyOrders(res.data))
//       } catch (error) {
//         console.log("Fetch orders error:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchOrders()
//   }, [dispatch])

//   /* ✅ Realtime order status updates */
//   useEffect(() => {
//     if (!socket || !userData) return

//     socket.on('update-status', ({ orderId, shopId, status, userId }) => {
//       if (userId === userData._id) {
//         dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }))
//       }
//     })

//     return () => {
//       socket.off('update-status')
//     }
//   }, [socket, userData, dispatch])

//   return (
//     <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4">
//       <div className="w-full max-w-[800px] p-4">

//         {/* Header */}
//         <div className="flex items-center gap-5 mb-6">
//           <div onClick={() => navigate("/")}>
//             <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
//           </div>
//           <h1 className="text-2xl font-bold">My Orders</h1>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <p className="text-center text-gray-500">
//             Loading order details...
//           </p>
//         )}

//         {/* No orders */}
//         {!loading && myOrders.length === 0 && (
//           <p className="text-center text-gray-500">
//             No orders found
//           </p>
//         )}

//         {/* Orders */}
//         <div className="space-y-6">
//           {!loading && myOrders.map(order =>
//             userData.role === "user" ? (
//               <UserOrderCard data={order} key={order._id} />
//             ) : userData.role === "owner" ? (
//               <OwnerOrderCard data={order} key={order._id} />
//             ) : null
//           )}
//         </div>

//       </div>
//     </div>
//   )
// }

// export default MyOrders
