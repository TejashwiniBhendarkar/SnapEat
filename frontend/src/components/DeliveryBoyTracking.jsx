import React from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

// 🚴 Delivery Boy Icon
const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// 🏠 Customer Icon
const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function DeliveryBoyTracking({ data }) {
  if (
    !data ||
    !data.deliveryBoyLocation ||
    !data.customerLocation
  ) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-gray-400">
        Waiting for location…
      </div>
    );
  }

  const { lat: deliveryBoyLat, lon: deliveryBoyLon } = data.deliveryBoyLocation;
  const { lat: customerLat, lon: customerLon } = data.customerLocation;

  // 🚨 Prevent map crash
  if (
    deliveryBoyLat == null ||
    deliveryBoyLon == null ||
    customerLat == null ||
    customerLon == null
  ) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-gray-400">
        Location not available
      </div>
    );
  }

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ];

  const center = [deliveryBoyLat, deliveryBoyLon];

  return (
    <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={15}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryBoyIcon}>
          <Popup>Delivery Boy</Popup>
        </Marker>

        <Marker position={[customerLat, customerLon]} icon={customerIcon}>
          <Popup>Customer</Popup>
        </Marker>

        <Polyline positions={path} color="blue" weight={4} />
      </MapContainer>
    </div>
  );
}

export default DeliveryBoyTracking;

// import React from 'react'
// import scooter from "../assets/scooter.png"
// import home from "../assets/home.png"
// import "leaflet/dist/leaflet.css"
// import L from "leaflet"
// import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
// const deliveryBoyIcon = new L.Icon({
//     iconUrl: scooter,
//     iconSize: [40, 40],
//     iconAnchor: [20, 40]
// })
// const customerIcon = new L.Icon({
//     iconUrl: home,
//     iconSize: [40, 40],
//     iconAnchor: [20, 40]
// })
// function DeliveryBoyTracking({ data }) {

//     const deliveryBoyLat = data.deliveryBoyLocation.lat
//     const deliveryBoylon = data.deliveryBoyLocation.lon
//     const customerLat = data.customerLocation.lat
//     const customerlon = data.customerLocation.lon

//     const path = [
//         [deliveryBoyLat, deliveryBoylon],
//         [customerLat, customerlon]
//     ]

//     const center = [deliveryBoyLat, deliveryBoylon]

//     return (
//         <div className='w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md'>
//             <MapContainer
//                 className={"w-full h-full"}
//                 center={center}
//                 zoom={16}
//             >
//                 <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//              <Marker position={[deliveryBoyLat,deliveryBoylon]} icon={deliveryBoyIcon}>
//              <Popup>Delivery Boy</Popup>
//              </Marker>
//               <Marker position={[customerLat,customerlon]} icon={customerIcon}>
//              <Popup>Delivery Boy</Popup>
//              </Marker>


// <Polyline positions={path} color='blue' weight={4}/>

//             </MapContainer>
//         </div>
//     )
// }

// export default DeliveryBoyTracking
