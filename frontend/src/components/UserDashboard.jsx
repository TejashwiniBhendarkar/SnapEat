import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } =
    useSelector(state => state.user)

  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
  const navigate = useNavigate()

  const [showLeftCateButton, setShowLeftCateButton] = useState(false)
  const [showRightCateButton, setShowRightCateButton] = useState(false)
  const [showLeftShopButton, setShowLeftShopButton] = useState(false)
  const [showRightShopButton, setShowRightShopButton] = useState(false)
  const [updatedItemsList, setUpdatedItemsList] = useState([])

  const handleFilterByCategory = (category) => {
    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity)
    } else {
      const filteredList = itemsInMyCity?.filter(i => i.category === category)
      setUpdatedItemsList(filteredList)
    }
  }

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)
  }, [itemsInMyCity])

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current
    if (element) {
      setLeftButton(element.scrollLeft > 0)
      setRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      )
    }
  }

  const scrollHandler = (ref, direction) => {
    ref.current?.scrollBy({
      left: direction === "left" ? -250 : 250,
      behavior: "smooth"
    })
  }

  useEffect(() => {
    if (!cateScrollRef.current || !shopScrollRef.current) return

    updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
    updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)

    const cateScroll = () =>
      updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
    const shopScroll = () =>
      updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)

    cateScrollRef.current.addEventListener("scroll", cateScroll)
    shopScrollRef.current.addEventListener("scroll", shopScroll)

    return () => {
      cateScrollRef.current?.removeEventListener("scroll", cateScroll)
      shopScrollRef.current?.removeEventListener("scroll", shopScroll)
    }
  }, [categories])

  return (
    <div className="w-full min-h-screen bg-[#fff9f6]">
      <Nav />

      {/* ================= HERO ================= */}
      <div className="w-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-12">
        <div className="max-w-7xl mx-auto text-white">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Hungry? Order from the best in {currentCity}
          </h1>
          <p className="mt-2 text-white/90 text-lg">
            Fresh food • Fast delivery • Trusted restaurants
          </p>
        </div>
      </div>

      {/* ================= SEARCH RESULTS ================= */}
      {searchItems && searchItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-10">
          <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {searchItems.map(item => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        </section>
      )}

      {/* ================= CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-14">
        <h2 className="text-2xl font-semibold mb-5">
          Inspiration for your first order
        </h2>

        <div className="relative">
          {showLeftCateButton && (
            <button
              onClick={() => scrollHandler(cateScrollRef, "left")}
              className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white shadow-xl p-2 rounded-full z-10"
            >
              <FaCircleChevronLeft className="text-orange-500 text-xl" />
            </button>
          )}

          <div
            ref={cateScrollRef}
            className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide"
          >
            {categories.map((cate, index) => (
              <CategoryCard
                key={index}
                name={cate.category}
                image={cate.image}
                onClick={() => handleFilterByCategory(cate.category)}
              />
            ))}
          </div>

          {showRightCateButton && (
            <button
              onClick={() => scrollHandler(cateScrollRef, "right")}
              className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white shadow-xl p-2 rounded-full z-10"
            >
              <FaCircleChevronRight className="text-orange-500 text-xl" />
            </button>
          )}
        </div>
      </section>

      {/* ================= SHOPS ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-semibold mb-5">
          Best Restaurants in {currentCity}
        </h2>

        <div className="relative">
          {showLeftShopButton && (
            <button
              onClick={() => scrollHandler(shopScrollRef, "left")}
              className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white shadow-xl p-2 rounded-full z-10"
            >
              <FaCircleChevronLeft className="text-orange-500 text-xl" />
            </button>
          )}

          <div
            ref={shopScrollRef}
            className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide"
          >
            {shopInMyCity?.map((shop, index) => (
              <CategoryCard
                key={index}
                name={shop.name}
                image={shop.image}
                onClick={() => navigate(`/shop/${shop._id}`)}
              />
            ))}
          </div>

          {showRightShopButton && (
            <button
              onClick={() => scrollHandler(shopScrollRef, "right")}
              className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white shadow-xl p-2 rounded-full z-10"
            >
              <FaCircleChevronRight className="text-orange-500 text-xl" />
            </button>
          )}
        </div>
      </section>

      {/* ================= FOOD ITEMS ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-16 pb-20">
        <h2 className="text-2xl font-semibold mb-6">
          Suggested Food Items
        </h2>

        <div className="flex flex-wrap gap-6 justify-center">
          {updatedItemsList?.map((item, index) => (
            <FoodCard key={index} data={item} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default UserDashboard

// import React, { useEffect, useRef, useState } from 'react'
// import Nav from './NaV.JSX'
// import { categories } from '../category'
// import CategoryCard from './CategoryCard'
// import { FaCircleChevronLeft } from "react-icons/fa6";
// import { FaCircleChevronRight } from "react-icons/fa6";
// import { useSelector } from 'react-redux';
// import FoodCard from './FoodCard';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { serverUrl } from '../App';

// function UserDashboard() {
//   const {currentCity,shopInMyCity,itemsInMyCity,searchItems}=useSelector(state=>state.user)
//   const cateScrollRef=useRef()
//   const shopScrollRef=useRef()
//   const navigate=useNavigate()
//   const [showLeftCateButton,setShowLeftCateButton]=useState(false)
//   const [showRightCateButton,setShowRightCateButton]=useState(false)
//    const [showLeftShopButton,setShowLeftShopButton]=useState(false)
//   const [showRightShopButton,setShowRightShopButton]=useState(false)
//   const [updatedItemsList,setUpdatedItemsList]=useState([])

// const handleFilterByCategory=(category)=>{
// if(category=="All"){
//   setUpdatedItemsList(itemsInMyCity)
// }else{
//   const filteredList=itemsInMyCity?.filter(i=>i.category===category)
//   setUpdatedItemsList(filteredList)
// }

// }

// useEffect(()=>{
// setUpdatedItemsList(itemsInMyCity)
// },[itemsInMyCity])


//   const updateButton=(ref,setLeftButton,setRightButton)=>{
// const element=ref.current
// if(element){
// setLeftButton(element.scrollLeft>0)
// setRightButton(element.scrollLeft+element.clientWidth<element.scrollWidth)

// }
//   }
//   const scrollHandler=(ref,direction)=>{
//     if(ref.current){
//       ref.current.scrollBy({
//         left:direction=="left"?-200:200,
//         behavior:"smooth"
//       })
//     }
//   }




//   useEffect(()=>{
//     if(cateScrollRef.current){
//       updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
//       updateButton(shopScrollRef,setShowLeftShopButton,setShowRightShopButton)
//       cateScrollRef.current.addEventListener('scroll',()=>{
//         updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
//       })
//       shopScrollRef.current.addEventListener('scroll',()=>{
//          updateButton(shopScrollRef,setShowLeftShopButton,setShowRightShopButton)
//       })
     
//     }

//     return ()=>{cateScrollRef?.current?.removeEventListener("scroll",()=>{
//         updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
//       })
//          shopScrollRef?.current?.removeEventListener("scroll",()=>{
//         updateButton(shopScrollRef,setShowLeftShopButton,setShowRightShopButton)
//       })}

//   },[categories])


//   return (
//     <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
//       <Nav />

//       {searchItems && searchItems.length>0 && (
//         <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4'>
// <h1 className='text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2'>
//   Search Results
// </h1>
// <div className='w-full h-auto flex flex-wrap gap-6 justify-center'>
//   {searchItems.map((item)=>(
//     <FoodCard data={item} key={item._id}/>
//   ))}
// </div>
//         </div>
//       )}

//       <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">

//         <h1 className='text-gray-800 text-2xl sm:text-3xl'>Inspiration for your first order</h1>
//         <div className='w-full relative'>
//           {showLeftCateButton &&  <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(cateScrollRef,"left")}><FaCircleChevronLeft />
//           </button>}
         

//           <div className='w-full flex overflow-x-auto gap-4 pb-2 ' ref={cateScrollRef}>
//             {categories.map((cate, index) => (
//               <CategoryCard name={cate.category} image={cate.image} key={index} onClick={()=>handleFilterByCategory(cate.category)}/>
//             ))}
//           </div>
//           {showRightCateButton &&  <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(cateScrollRef,"right")}>
// <FaCircleChevronRight />
//           </button>}
         
//         </div>
//       </div>

//       <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
//  <h1 className='text-gray-800 text-2xl sm:text-3xl'>Best Shop in {currentCity}</h1>
//  <div className='w-full relative'>
//           {showLeftShopButton &&  <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(shopScrollRef,"left")}><FaCircleChevronLeft />
//           </button>}
         

//           <div className='w-full flex overflow-x-auto gap-4 pb-2 ' ref={shopScrollRef}>
//             {shopInMyCity?.map((shop, index) => (
//               <CategoryCard name={shop.name} image={shop.image} key={index} onClick={()=>navigate(`/shop/${shop._id}`)}/>
//             ))}
//           </div>
//           {showRightShopButton &&  <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(shopScrollRef,"right")}>
// <FaCircleChevronRight />
//           </button>}
         
//         </div>
//       </div>

//       <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
//        <h1 className='text-gray-800 text-2xl sm:text-3xl'>
//         Suggested Food Items
//        </h1>

// <div className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
// {updatedItemsList?.map((item,index)=>(
//   <FoodCard key={index} data={item}/>
// ))}
// </div>


//       </div>


//     </div>
//   )
// }

// export default UserDashboard
