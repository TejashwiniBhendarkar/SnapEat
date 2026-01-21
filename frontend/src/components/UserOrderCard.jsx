import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";

function UserOrderCard({ data }) {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState({}); // itemId: rating

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const handleRating = async (itemId, rating) => {
    try {
      await axios.post(
        `${serverUrl}/api/item/rating`,
        { itemId, rating },
        { withCredentials: true }
      );

      setSelectedRating(prev => ({
        ...prev,
        [itemId]: rating
      }));
    } catch (error) {
      console.error(error);
    }
  };

  // 🛑 SAFETY CHECK
  if (!data || !data.shopOrders?.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between border-b pb-2">
        <div>
          <p className="font-semibold">
            Order #{data._id?.slice(-6)}
          </p>
          <p className="text-sm text-gray-500">
            Date: {formatDate(data.createdAt)}
          </p>
        </div>

        <div className="text-right">
          {data.paymentMethod === "cod" ? (
            <p className="text-sm text-gray-500">
              {data.paymentMethod.toUpperCase()}
            </p>
          ) : (
            <p className="text-sm text-gray-500 font-semibold">
              Payment: {data.payment ? "Paid" : "Pending"}
            </p>
          )}
        </div>
      </div>

      {/* SHOP ORDERS */}
      {data.shopOrders.map((shopOrder, index) => (
        <div
          key={index}
          className="border rounded-lg p-3 bg-[#fffaf7] space-y-3"
        >
          <p className="font-semibold">
            {shopOrder.shop?.name || "Shop"}
          </p>

          {/* ITEMS */}
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {shopOrder.shopOrderItems.map((orderItem, idx) => {
              const item = orderItem.item; // ⚠️ CAN BE NULL

              return (
                <div
                  key={idx}
                  className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
                >
                  {/* ✅ SAFE IMAGE */}
                  {item?.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}

                  <p className="text-sm font-semibold mt-1">
                    {item?.name || orderItem.name || "Item removed"}
                  </p>

                  <p className="text-xs text-gray-500">
                    Qty: {orderItem.quantity} × ₹{orderItem.price}
                  </p>

                  {/* ⭐ RATING */}
                  {shopOrder.status === "delivered" && item?._id && (
                    <div className="flex space-x-1 mt-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          className={`text-lg ${
                            selectedRating[item._id] >= star
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                          onClick={() =>
                            handleRating(item._id, star)
                          }
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center border-t pt-2">
            <p className="font-semibold">
              Subtotal: ₹{shopOrder.subtotal}
            </p>
            <span className="text-sm font-medium text-blue-600">
              {shopOrder.status}
            </span>
          </div>
        </div>
      ))}

      {/* FOOTER */}
      <div className="flex justify-between items-center border-t pt-2">
        <p className="font-semibold">
          Total: ₹{data.totalAmount}
        </p>
        <button
          className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm"
          onClick={() => navigate(`/track-order/${data._id}`)}
        >
          Track Order
        </button>
      </div>
    </div>
  );
}

export default UserOrderCard;
