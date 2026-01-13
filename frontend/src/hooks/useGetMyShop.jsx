import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyShopData } from '../redux/ownerSlice'

function useGetMyshop() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)

  useEffect(() => {
    // ⛔ Stop if user not logged in
    if (!userData) return

    const fetchShop = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-my`,
          { withCredentials: true }
        )
        dispatch(setMyShopData(result.data))
      } catch (error) {
        if (error.response?.status !== 401) {
          console.log(error)
        }
      }
    }

    fetchShop()
  }, [userData, dispatch])
}

export default useGetMyshop

// import axios from 'axios'
// import React, { useEffect } from 'react'
// import { serverUrl } from '../App'
// import { useDispatch, useSelector } from 'react-redux'
// import { setUserData } from '../redux/userSlice'
// import { setMyShopData } from '../redux/ownerSlice'

// function useGetMyshop() {
//     const dispatch=useDispatch()
//     const {userData}=useSelector(state=>state.user)
//   useEffect(()=>{
//   const fetchShop=async () => {
//     try {
//            const result=await axios.get(`${serverUrl}/api/shop/get-my`,{withCredentials:true})
//             dispatch(setMyShopData(result.data))
  
//     } catch (error) {
//         console.log(error)
//     }
// }
// fetchShop()
 
//   },[userData])
// }

// export default useGetMyshop
