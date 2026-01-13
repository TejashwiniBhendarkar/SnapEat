import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useSelector } from 'react-redux'

function useUpdateLocation() {
  const { userData } = useSelector(state => state.user)

  useEffect(() => {
    // ⛔ Do nothing if user is not logged in
    if (!userData) return

    const updateLocation = async (lat, lon) => {
      try {
        const result = await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true }
        )
        console.log(result.data)
      } catch (error) {
        if (error.response?.status !== 401) {
          console.log(error)
        }
      }
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        updateLocation(
          position.coords.latitude,
          position.coords.longitude
        )
      },
      error => {
        console.log('Geolocation error:', error)
      }
    )
  }, [userData])
}

export default useUpdateLocation

// import axios from 'axios'
// import { useEffect } from 'react'
// import { serverUrl } from '../App'
// import { useDispatch, useSelector } from 'react-redux'

// function useUpdateLocation() {
//   const dispatch = useDispatch()
//   const { userData } = useSelector(state => state.user)

//   useEffect(() => {
//     // ⛔ Do nothing if user is not logged in
//     if (!userData) return

//     const updateLocation = async (lat, lon) => {
//       try {
//         const result = await axios.post(
//           `${serverUrl}/api/user/update-location`,
//           { lat, lon },
//           { withCredentials: true }
//         )
//         console.log(result.data)
//       } catch (error) {
//         if (error.response?.status !== 401) {
//           console.log(error)
//         }
//       }
//     }

//     const watchId = navigator.geolocation.watchPosition(
//       position => {
//         updateLocation(
//           position.coords.latitude,
//           position.coords.longitude
//         )
//       },
//       error => {
//         console.log('Geolocation error:', error)
//       }
//     )

//     // ✅ cleanup watcher
//     return () => {
//       navigator.geolocation.clearWatch(watchId)
//     }
//   }, [userData])
// }

// export default useUpdateLocation
