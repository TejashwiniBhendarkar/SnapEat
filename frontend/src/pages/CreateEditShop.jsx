import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';

function CreateEditShop() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { myShopData } = useSelector(state => state.owner)
  const { currentCity, currentState, currentAddress } = useSelector(state => state.user)

  const [name, setName] = useState(myShopData?.name || "")
  const [address, setAddress] = useState(myShopData?.address || "")
  const [city, setCity] = useState(myShopData?.city || "")
  const [stateValue, setStateValue] = useState(myShopData?.state || "")
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null)
  const [backendImage, setBackendImage] = useState(null)
  const [loading, setLoading] = useState(false)

  // ✅ Sync Redux location → local state
  useEffect(() => {
    if (!myShopData) {
      if (currentCity) setCity(currentCity)
      if (currentState) setStateValue(currentState)
      if (currentAddress) setAddress(currentAddress)
    }
  }, [currentCity, currentState, currentAddress, myShopData])

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // ✅ Frontend validation (VERY IMPORTANT)
    if (!name || !city || !stateValue || !address) {
      alert("Please fill all fields")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("city", city)
      formData.append("state", stateValue)
      formData.append("address", address)

      if (backendImage) {
        formData.append("image", backendImage)
      }

      const result = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        { withCredentials: true }
      )

      dispatch(setMyShopData(result.data))
      navigate("/")
    } catch (error) {
      console.log(error)
      alert("Failed to save shop")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen relative'>
      <div className='absolute top-[20px] left-[20px]' onClick={() => navigate("/")}>
        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
      </div>

      <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
        <div className='flex flex-col items-center mb-6'>
          <div className='bg-orange-100 p-4 rounded-full mb-4'>
            <FaUtensils className='text-[#ff4d2d] w-16 h-16' />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>

        <form className='space-y-5' onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Shop Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className='w-full px-4 py-2 border rounded-lg'
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className='w-full px-4 py-2 border rounded-lg'
          />

          {frontendImage && (
            <img src={frontendImage} alt="preview" className='w-full h-48 object-cover rounded-lg border' />
          )}

          <input
            type="text"
            placeholder="City"
            value={city || ""}
            onChange={e => setCity(e.target.value)}
            className='w-full px-4 py-2 border rounded-lg'
          />

          <input
            type="text"
            placeholder="State"
            value={stateValue || ""}
            onChange={e => setStateValue(e.target.value)}
            className='w-full px-4 py-2 border rounded-lg'
          />

          <input
            type="text"
            placeholder="Address"
            value={address || ""}
            onChange={e => setAddress(e.target.value)}
            className='w-full px-4 py-2 border rounded-lg'
          />

          <button
            className='w-full bg-[#ff4d2d] text-white py-3 rounded-lg'
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Save"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateEditShop
