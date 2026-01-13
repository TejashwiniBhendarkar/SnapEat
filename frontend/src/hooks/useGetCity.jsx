import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState
} from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useGetCity() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  const apiKey = import.meta.env.VITE_GEOAPIKEY

  useEffect(() => {
    // ⛔ STOP if user is not logged in
    if (!userData) return

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude

          dispatch(setLocation({ lat: latitude, lon: longitude }))

          const result = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse`,
            {
              params: {
                lat: latitude,
                lon: longitude,
                format: "json",
                apiKey
              }
            }
          )

          const location = result?.data?.results?.[0]
          if (!location) return

          // ✅ ROBUST CITY DETECTION (THIS IS THE FIX)
          const detectedCity =
            location.city ||
            location.town ||
            location.village ||
            location.municipality ||
            location.suburb ||
            location.county ||
            location.state_district ||
            null

          console.log("Detected city:", detectedCity)

          dispatch(setCurrentCity(detectedCity))
          dispatch(setCurrentState(location.state || null))
          dispatch(
            setCurrentAddress(
              location.address_line2 || location.address_line1 || ""
            )
          )
          dispatch(setAddress(location.address_line2 || ""))
        } catch (error) {
          console.log("Geo API error:", error)
        }
      },
      (error) => {
        console.log("Geolocation error:", error)
      }
    )
  }, [userData, apiKey, dispatch])
}

export default useGetCity

// import axios from 'axios'
// import { useEffect } from 'react'
// import { serverUrl } from '../App'
// import { useDispatch, useSelector } from 'react-redux'
// import {
//   setCurrentAddress,
//   setCurrentCity,
//   setCurrentState
// } from '../redux/userSlice'
// import { setAddress, setLocation } from '../redux/mapSlice'

// function useGetCity() {
//   const dispatch = useDispatch()
//   const { userData } = useSelector(state => state.user)
//   const apiKey = import.meta.env.VITE_GEOAPIKEY

//   useEffect(() => {
//     // ⛔ STOP if user is not logged in
//     if (!userData) return

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           const latitude = position.coords.latitude
//           const longitude = position.coords.longitude

//           dispatch(setLocation({ lat: latitude, lon: longitude }))

//           const result = await axios.get(
//             `https://api.geoapify.com/v1/geocode/reverse`,
//             {
//               params: {
//                 lat: latitude,
//                 lon: longitude,
//                 format: "json",
//                 apiKey
//               }
//             }
//           )

//           const location = result?.data?.results?.[0]

//           if (!location) return

//           dispatch(
//             setCurrentCity(location.city || location.county)
//           )
//           dispatch(setCurrentState(location.state))
//           dispatch(
//             setCurrentAddress(
//               location.address_line2 || location.address_line1
//             )
//           )
//           dispatch(setAddress(location.address_line2))
//         } catch (error) {
//           console.log("Geo API error:", error)
//         }
//       },
//       (error) => {
//         console.log("Geolocation error:", error)
//       }
//     )
//   }, [userData, apiKey, dispatch])
// }

// export default useGetCity
