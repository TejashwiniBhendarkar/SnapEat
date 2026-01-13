import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity } from '../redux/userSlice'

function useGetItemsByCity() {
  const dispatch = useDispatch()
  const { currentCity, userData } = useSelector(state => state.user)

  useEffect(() => {
    // ⛔ STOP if user not logged in
    if (!userData) return

    // ⛔ STOP if city is not available
    if (!currentCity) return

    const fetchItems = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-city/${currentCity}`,
          { withCredentials: true }
        )
        dispatch(setItemsInMyCity(result.data))
        console.log(result.data)
      } catch (error) {
        if (error.response?.status !== 401) {
          console.log(error)
        }
      }
    }

    fetchItems()
  }, [currentCity, userData, dispatch])
}

export default useGetItemsByCity

// import axios from 'axios'
// import React, { useEffect } from 'react'
// import { serverUrl } from '../App'
// import { useDispatch, useSelector } from 'react-redux'
// import { setItemsInMyCity, setShopsInMyCity, setUserData } from '../redux/userSlice'

// function useGetItemsByCity() {
//     const dispatch=useDispatch()
//     const {currentCity}=useSelector(state=>state.user)
//   useEffect(()=>{
//   const fetchItems=async () => {
//     try {
//            const result=await axios.get(`${serverUrl}/api/item/get-by-city/${currentCity}`,{withCredentials:true})
//             dispatch(setItemsInMyCity(result.data))
//            console.log(result.data)
//     } catch (error) {
//         console.log(error)
//     }
// }
// fetchItems()
 
//   },[currentCity])
// }

// export default useGetItemsByCity
