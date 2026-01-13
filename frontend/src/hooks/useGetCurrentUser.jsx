import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function useGetCurrentUser() {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/current`,
          { withCredentials: true }
        )
        dispatch(setUserData(result.data))
      } catch (error) {
        // ✅ 401 is NORMAL if user is not logged in
        if (error.response?.status !== 401) {
          console.log(error)
        }
      }
    }

    fetchUser()
  }, [dispatch])
}

export default useGetCurrentUser

// import axios from 'axios'
// import React, { useEffect } from 'react'
// import { serverUrl } from '../App'
// import { useDispatch } from 'react-redux'
// import { setUserData } from '../redux/userSlice'

// function useGetCurrentUser() {
//     const dispatch=useDispatch()
//   useEffect(()=>{
//   const fetchUser=async () => {
//     try {
//            const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
//             dispatch(setUserData(result.data))
  
//     } catch (error) {
//         console.log(error)
//     }
// }
// fetchUser()
 
//   },[])
// }

// export default useGetCurrentUser
