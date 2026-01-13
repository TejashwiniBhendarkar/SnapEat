import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io"
import { IoSearchOutline, IoLocationSharp } from "react-icons/io5"
import { TbCurrentLocation } from "react-icons/tb"
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'
import "leaflet/dist/leaflet.css"
import { setAddress, setLocation } from '../redux/mapSlice'
import { MdDeliveryDining } from "react-icons/md"
import { FaCreditCard } from "react-icons/fa"
import axios from 'axios'
import { FaMobileScreenButton } from "react-icons/fa6"
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { addMyOrder } from '../redux/userSlice'

/* ✅ SAFE RECENTER MAP */
function RecenterMap({ location }) {
  const map = useMap()

  useEffect(() => {
    if (location?.lat && location?.lon) {
      map.setView([location.lat, location.lon], 16)
    }
  }, [location, map])

  return null
}

function CheckOut() {
  const { location, address } = useSelector(state => state.map)
  const { cartItems, totalAmount, userData } = useSelector(state => state.user)

  const [addressInput, setAddressInput] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_GEOAPIKEY

  const deliveryFee = totalAmount > 500 ? 0 : 40
  const AmountWithDeliveryFee = totalAmount + deliveryFee

  /* 📍 MARKER DRAG */
  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat, lon: lng }))
    getAddressByLatLng(lat, lng)
  }

  /* 📍 CURRENT LOCATION */
  const getCurrentLocation = () => {
    if (!userData?.location?.coordinates) return
    const latitude = userData.location.coordinates[1]
    const longitude = userData.location.coordinates[0]
    dispatch(setLocation({ lat: latitude, lon: longitude }))
    getAddressByLatLng(latitude, longitude)
  }

  /* 📍 REVERSE GEOCODE */
  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      )
      dispatch(setAddress(result?.data?.results?.[0]?.address_line2 || ""))
    } catch (error) {
      console.log(error)
    }
  }

  /* 📍 SEARCH ADDRESS */
  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`
      )
      const { lat, lon } = result.data.features[0].properties
      dispatch(setLocation({ lat, lon }))
    } catch (error) {
      console.log(error)
    }
  }

  /* 💳 RAZORPAY */
  const openRazorpayWindow = (orderId, razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: "INR",
      name: "CraveCart",
      description: "Food Order",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const verify = await axios.post(
            `${serverUrl}/api/order/verify-payment`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              orderId
            },
            { withCredentials: true }
          )
          dispatch(addMyOrder(verify.data))
          navigate("/order-placed")
        } catch (err) {
          console.log(err)
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  /* 🛒 PLACE ORDER */
  const handlePlaceOrder = async () => {
    try {
      // ✅ CLEAN CART (VERY IMPORTANT)
      const cleanCartItems = cartItems.map(item => ({
        itemId: item.id,
        shop: item.shop,
        price: item.price,
        quantity: item.quantity,
        name: item.name
      }))

      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.lon
          },
          totalAmount: AmountWithDeliveryFee,
          cartItems: cleanCartItems
        },
        { withCredentials: true }
      )

      if (paymentMethod === "cod") {
        dispatch(addMyOrder(result.data))
        navigate("/order-placed")
      } else {
        openRazorpayWindow(result.data.orderId, result.data.razorOrder)
      }

    } catch (error) {
      console.log(error)
      alert("Failed to place order")
    }
  }

  useEffect(() => {
    setAddressInput(address)
  }, [address])

  return (
    <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
      <div className='absolute top-5 left-5' onClick={() => navigate("/")}>
        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
      </div>

      <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
        <h1 className='text-2xl font-bold'>Checkout</h1>

        {/* LOCATION */}
        <section>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            <IoLocationSharp className='text-[#ff4d2d]' /> Delivery Location
          </h2>

          <div className='flex gap-2 my-3'>
            <input
              className='flex-1 border rounded-lg p-2'
              value={addressInput}
              onChange={e => setAddressInput(e.target.value)}
            />
            <button onClick={getLatLngByAddress} className='bg-[#ff4d2d] text-white px-3 rounded-lg'>
              <IoSearchOutline />
            </button>
            <button onClick={getCurrentLocation} className='bg-blue-500 text-white px-3 rounded-lg'>
              <TbCurrentLocation />
            </button>
          </div>

          {location?.lat && location?.lon && (
            <div className='h-64 border rounded-xl overflow-hidden'>
              <MapContainer className='w-full h-full' center={[location.lat, location.lon]} zoom={16}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RecenterMap location={location} />
                <Marker position={[location.lat, location.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />
              </MapContainer>
            </div>
          )}
        </section>

        {/* PAYMENT */}
        <section>
          <div onClick={() => setPaymentMethod("cod")} className={`p-4 border rounded-xl cursor-pointer ${paymentMethod === "cod" && "border-[#ff4d2d] bg-orange-50"}`}>
            <MdDeliveryDining /> Cash On Delivery
          </div>

          <div onClick={() => setPaymentMethod("online")} className={`p-4 border rounded-xl mt-2 cursor-pointer ${paymentMethod === "online" && "border-[#ff4d2d] bg-orange-50"}`}>
            <FaMobileScreenButton /> <FaCreditCard /> Online Payment
          </div>
        </section>

        {/* SUMMARY */}
        <section className='border p-4 rounded-xl bg-gray-50'>
          {cartItems.map(item => (
            <div key={item.id} className='flex justify-between'>
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <hr className='my-2' />
          <div className='flex justify-between font-bold text-[#ff4d2d]'>
            <span>Total</span>
            <span>₹{AmountWithDeliveryFee}</span>
          </div>
        </section>

        <button
          onClick={handlePlaceOrder}
          className='w-full bg-[#ff4d2d] text-white py-3 rounded-xl font-semibold'
        >
          {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
        </button>
      </div>
    </div>
  )
}

export default CheckOut

// import React, { useEffect, useState } from 'react'
// import { IoIosArrowRoundBack } from "react-icons/io"
// import { IoSearchOutline, IoLocationSharp } from "react-icons/io5"
// import { TbCurrentLocation } from "react-icons/tb"
// import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
// import { useDispatch, useSelector } from 'react-redux'
// import "leaflet/dist/leaflet.css"
// import { setAddress, setLocation } from '../redux/mapSlice'
// import { MdDeliveryDining } from "react-icons/md"
// import { FaCreditCard } from "react-icons/fa"
// import axios from 'axios'
// import { FaMobileScreenButton } from "react-icons/fa6"
// import { useNavigate } from 'react-router-dom'
// import { serverUrl } from '../App'
// import { addMyOrder } from '../redux/userSlice'

// /* ✅ SAFE RECENTER COMPONENT */
// function RecenterMap({ location }) {
//   const map = useMap()

//   useEffect(() => {
//     if (location?.lat && location?.lon) {
//       map.setView([location.lat, location.lon], 16)
//     }
//   }, [location, map])

//   return null
// }

// function CheckOut() {
//   const { location, address } = useSelector(state => state.map)
//   const { cartItems, totalAmount, userData } = useSelector(state => state.user)

//   const [addressInput, setAddressInput] = useState("")
//   const [paymentMethod, setPaymentMethod] = useState("cod")

//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const apiKey = import.meta.env.VITE_GEOAPIKEY

//   const deliveryFee = totalAmount > 500 ? 0 : 40
//   const AmountWithDeliveryFee = totalAmount + deliveryFee

//   /* 📍 MARKER DRAG */
//   const onDragEnd = (e) => {
//     const { lat, lng } = e.target._latlng
//     dispatch(setLocation({ lat, lon: lng }))
//     getAddressByLatLng(lat, lng)
//   }

//   /* 📍 CURRENT LOCATION */
//   const getCurrentLocation = () => {
//     if (!userData?.location) return
//     const latitude = userData.location.coordinates[1]
//     const longitude = userData.location.coordinates[0]
//     dispatch(setLocation({ lat: latitude, lon: longitude }))
//     getAddressByLatLng(latitude, longitude)
//   }

//   /* 📍 REVERSE GEOCODE */
//   const getAddressByLatLng = async (lat, lng) => {
//     try {
//       const result = await axios.get(
//         `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
//       )
//       dispatch(setAddress(result?.data?.results[0]?.address_line2 || ""))
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   /* 📍 SEARCH ADDRESS */
//   const getLatLngByAddress = async () => {
//     try {
//       const result = await axios.get(
//         `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`
//       )
//       const { lat, lon } = result.data.features[0].properties
//       dispatch(setLocation({ lat, lon }))
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   /* 🛒 PLACE ORDER */
//   const handlePlaceOrder = async () => {
//     try {
//       const result = await axios.post(
//         `${serverUrl}/api/order/place-order`,
//         {
//           paymentMethod,
//           deliveryAddress: {
//             text: addressInput,
//             latitude: location.lat,
//             longitude: location.lon
//           },
//           totalAmount: AmountWithDeliveryFee,
//           cartItems
//         },
//         { withCredentials: true }
//       )

//       if (paymentMethod === "cod") {
//         dispatch(addMyOrder(result.data))
//         navigate("/order-placed")
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     setAddressInput(address)
//   }, [address])

//   return (
//     <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
//       <div className='absolute top-5 left-5' onClick={() => navigate("/")}>
//         <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
//       </div>

//       <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
//         <h1 className='text-2xl font-bold'>Checkout</h1>

//         {/* 📍 LOCATION */}
//         <section>
//           <h2 className='text-lg font-semibold flex items-center gap-2'>
//             <IoLocationSharp className='text-[#ff4d2d]' /> Delivery Location
//           </h2>

//           <div className='flex gap-2 my-3'>
//             <input
//               className='flex-1 border rounded-lg p-2'
//               value={addressInput}
//               onChange={e => setAddressInput(e.target.value)}
//               placeholder='Enter delivery address'
//             />
//             <button onClick={getLatLngByAddress} className='bg-[#ff4d2d] text-white px-3 rounded-lg'>
//               <IoSearchOutline />
//             </button>
//             <button onClick={getCurrentLocation} className='bg-blue-500 text-white px-3 rounded-lg'>
//               <TbCurrentLocation />
//             </button>
//           </div>

//           {/* 🗺️ MAP (SAFE) */}
//           {location?.lat && location?.lon && (
//             <div className='h-64 border rounded-xl overflow-hidden'>
//               <MapContainer
//                 className='w-full h-full'
//                 center={[location.lat, location.lon]}
//                 zoom={16}
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 <RecenterMap location={location} />
//                 <Marker
//                   position={[location.lat, location.lon]}
//                   draggable
//                   eventHandlers={{ dragend: onDragEnd }}
//                 />
//               </MapContainer>
//             </div>
//           )}
//         </section>

//         {/* 💳 PAYMENT */}
//         <section>
//           <h2 className='text-lg font-semibold'>Payment Method</h2>

//           <div
//             className={`p-4 border rounded-xl mt-2 cursor-pointer ${
//               paymentMethod === "cod" && "border-[#ff4d2d] bg-orange-50"
//             }`}
//             onClick={() => setPaymentMethod("cod")}
//           >
//             <MdDeliveryDining /> Cash On Delivery
//           </div>

//           <div
//             className={`p-4 border rounded-xl mt-2 cursor-pointer ${
//               paymentMethod === "online" && "border-[#ff4d2d] bg-orange-50"
//             }`}
//             onClick={() => setPaymentMethod("online")}
//           >
//             <FaMobileScreenButton /> <FaCreditCard /> Online Payment
//           </div>
//         </section>

//         {/* 🧾 SUMMARY */}
//         <section className='border p-4 rounded-xl bg-gray-50'>
//           {cartItems.map(item => (
//             <div key={item.id} className='flex justify-between text-sm'>
//               <span>{item.name} x {item.quantity}</span>
//               <span>₹{item.price * item.quantity}</span>
//             </div>
//           ))}

//           <hr className='my-2' />

//           <div className='flex justify-between'>
//             <span>Delivery</span>
//             <span>{deliveryFee === 0 ? "Free" : deliveryFee}</span>
//           </div>

//           <div className='flex justify-between font-bold text-[#ff4d2d]'>
//             <span>Total</span>
//             <span>₹{AmountWithDeliveryFee}</span>
//           </div>
//         </section>

//         <button
//           onClick={handlePlaceOrder}
//           className='w-full bg-[#ff4d2d] text-white py-3 rounded-xl font-semibold'
//         >
//           {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
//         </button>
//       </div>
//     </div>
//   )
// }

// export default CheckOut
