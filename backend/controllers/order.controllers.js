import DeliveryAssignment from "../models/deliveryAssignment.model.js"
import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"
import User from "../models/user.model.js"
import { sendDeliveryOtpMail } from "../utils/mail.js"
import RazorPay from "razorpay"
import dotenv from "dotenv"
import { count } from "console"

dotenv.config()
let instance = new RazorPay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// export const placeOrder = async (req, res) => {
//     try {
//         const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body
//         if (cartItems.length == 0 || !cartItems) {
//             return res.status(400).json({ message: "cart is empty" })
//         }
//         if (!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude) {
//             return res.status(400).json({ message: "send complete deliveryAddress" })
//         }

//         const groupItemsByShop = {}

//         cartItems.forEach(item => {
//             const shopId = item.shop
//             if (!groupItemsByShop[shopId]) {
//                 groupItemsByShop[shopId] = []
//             }
//             groupItemsByShop[shopId].push(item)
//         });

//         const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {
//             const shop = await Shop.findById(shopId).populate("owner")
//             if (!shop) {
//                 return res.status(400).json({ message: "shop not found" })
//             }
//             const items = groupItemsByShop[shopId]
//             const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)
//             return {
//                 shop: shop._id,
//                 owner: shop.owner._id,
//                 subtotal,
//                 shopOrderItems: items.map((i) => ({
//                     item: i.id,
//                     price: i.price,
//                     quantity: i.quantity,
//                     name: i.name
//                 }))
//             }
//         }
//         ))

//         if (paymentMethod == "online") {
//             const razorOrder = await instance.orders.create({
//                 amount: Math.round(totalAmount * 100),
//                 currency: 'INR',
//                 receipt: `receipt_${Date.now()}`
//             })
//             const newOrder = await Order.create({
//                 user: req.userId,
//                 paymentMethod,
//                 deliveryAddress,
//                 totalAmount,
//                 shopOrders,
//                 razorpayOrderId: razorOrder.id,
//                 payment: false
//             })

//             return res.status(200).json({
//                 razorOrder,
//                 orderId: newOrder._id,
//             })

//         }

//         const newOrder = await Order.create({
//             user: req.userId,
//             paymentMethod,
//             deliveryAddress,
//             totalAmount,
//             shopOrders
//         })

//         await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")
//         await newOrder.populate("shopOrders.shop", "name")
//         await newOrder.populate("shopOrders.owner", "name socketId")
//         await newOrder.populate("user", "name email mobile")

//         const io = req.app.get('io')

//         if (io) {
//             newOrder.shopOrders.forEach(shopOrder => {
//                 const ownerSocketId = shopOrder.owner.socketId
//                 if (ownerSocketId) {
//                     io.to(ownerSocketId).emit('newOrder', {
//                         _id: newOrder._id,
//                         paymentMethod: newOrder.paymentMethod,
//                         user: newOrder.user,
//                         shopOrders: shopOrder,
//                         createdAt: newOrder.createdAt,
//                         deliveryAddress: newOrder.deliveryAddress,
//                         payment: newOrder.payment
//                     })
//                 }
//             });
//         }



//         return res.status(201).json(newOrder)
//     } catch (error) {
//         return res.status(500).json({ message: `place order error ${error}` })
//     }
// }
export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "cart is empty" })
    }

    if (
      !deliveryAddress?.text ||
      deliveryAddress.latitude == null ||
      deliveryAddress.longitude == null
    ) {
      return res.status(400).json({ message: "send complete deliveryAddress" })
    }

    // 🔹 GROUP ITEMS BY SHOP
    const groupItemsByShop = {}
    cartItems.forEach(item => {
      if (!groupItemsByShop[item.shop]) {
        groupItemsByShop[item.shop] = []
      }
      groupItemsByShop[item.shop].push(item)
    })

    // 🔹 CREATE SHOP ORDERS
    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async shopId => {
        const shop = await Shop.findById(shopId).populate("owner")
        if (!shop) throw new Error("Shop not found")

        const items = groupItemsByShop[shopId]
        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        )

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItems: items.map(i => ({
            item: i.itemId || i.id, // ✅ FIX
            price: Number(i.price),
            quantity: Number(i.quantity),
            name: i.name
          }))
        }
      })
    )

    // 🔹 ONLINE PAYMENT
    if (paymentMethod === "online") {
      const razorOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      })

      const newOrder = await Order.create({
        user: req.userId,
        paymentMethod,
        deliveryAddress,
        totalAmount,
        shopOrders,
        razorpayOrderId: razorOrder.id,
        payment: false
      })

      return res.status(200).json({
        razorOrder,
        orderId: newOrder._id
      })
    }

    // 🔹 CASH ON DELIVERY
    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders
    })

    return res.status(201).json(newOrder)

  } catch (error) {
    console.error("PLACE ORDER ERROR:", error)
    return res.status(500).json({ message: error.message })
  }
}


export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, orderId } = req.body
        const payment = await instance.payments.fetch(razorpay_payment_id)
        if (!payment || payment.status != "captured") {
            return res.status(400).json({ message: "payment not captured" })
        }
        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }

        order.payment = true
        order.razorpayPaymentId = razorpay_payment_id
        await order.save()

        await order.populate("shopOrders.shopOrderItems.item", "name image price")
        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.owner", "name socketId")
        await order.populate("user", "name email mobile")

        const io = req.app.get('io')

        if (io) {
            order.shopOrders.forEach(shopOrder => {
                const ownerSocketId = shopOrder.owner.socketId
                if (ownerSocketId) {
                    io.to(ownerSocketId).emit('newOrder', {
                        _id: order._id,
                        paymentMethod: order.paymentMethod,
                        user: order.user,
                        shopOrders: shopOrder,
                        createdAt: order.createdAt,
                        deliveryAddress: order.deliveryAddress,
                        payment: order.payment
                    })
                }
            });
        }


        return res.status(200).json(order)

    } catch (error) {
        return res.status(500).json({ message: `verify payment  error ${error}` })
    }
}



export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (user.role == "user") {
            const orders = await Order.find({ user: req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("shopOrders.owner", "name email mobile")
                .populate("shopOrders.shopOrderItems.item", "name image price")

            return res.status(200).json(orders)
        }  else if (user.role === "owner") {

  const orders = await Order.find({ "shopOrders.owner": req.userId })
    .sort({ createdAt: -1 })
    .populate("user")
    .populate("shopOrders.shop", "name")
    .populate("shopOrders.owner", "name email mobile") // ✅ REQUIRED
    .populate("shopOrders.shopOrderItems.item", "name image price")
    .populate("shopOrders.assignedDeliveryBoy", "fullName mobile")

  const formattedOrders = orders
    .map(order => {
      const shopOrder = order.shopOrders.find(
        so => String(so.owner._id) === String(req.userId)
      )

      if (!shopOrder) return null

      return {
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: shopOrder, // ✅ ALWAYS EXISTS NOW
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
        payment: order.payment
      }
    })
    .filter(Boolean)

  return res.status(200).json(formattedOrders)
}


    } catch (error) {
        return res.status(500).json({ message: `get User order error ${error}` })
    }
}



// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId, shopId } = req.params;
//     const { status } = req.body;

//     const order = await Order.findById(orderId).populate("shopOrders.shop");
//     const shopOrder = order.shopOrders.find(
//       so => String(so.shop._id) === String(shopId)
//     );

//     shopOrder.status = status;

//     if (status === "out of delivery" && !shopOrder.assignment) {
//       const { latitude, longitude } = order.deliveryAddress;

//       const deliveryBoys = await User.find({
//         role: "deliveryBoy",
//         socketId: { $ne: null }, // 🔥 IMPORTANT
//         location: {
//           $near: {
//             $geometry: {
//               type: "Point",
//               coordinates: [longitude, latitude]
//             },
//             $maxDistance: 5000
//           }
//         }
//       });

//       if (deliveryBoys.length === 0) {
//         await order.save();
//         return res.json({ message: "No delivery boys online" });
//       }

//       const assignment = await DeliveryAssignment.create({
//         order: order._id,
//         shop: shopOrder.shop._id,
//         shopOrderId: shopOrder._id,
//         brodcastedTo: deliveryBoys.map(b => b._id),
//         status: "brodcasted"
//       });

//       shopOrder.assignment = assignment._id;
//       await order.save();

//       const io = req.app.get("io");

//       deliveryBoys.forEach(boy => {
//         io.to(boy.socketId).emit("newAssignment", {
//           assignmentId: assignment._id,
//           shopName: shopOrder.shop.name, // ✅ NOW WORKS
//           deliveryAddress: order.deliveryAddress,
//           items: shopOrder.shopOrderItems,
//           subtotal: shopOrder.subtotal
//         });
//       });
//     }

//     res.json({ message: "Order moved to out for delivery" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId).populate("shopOrders.shop");
    const shopOrder = order.shopOrders.find(
      so => String(so.shop._id) === String(shopId)
    );

    if (!shopOrder) {
      return res.status(400).json({ message: "Shop order not found" });
    }

    shopOrder.status = status;

    if (status === "out of delivery" && !shopOrder.assignment) {
      const { latitude, longitude } = order.deliveryAddress;

      const deliveryBoys = await User.find({
        role: "deliveryBoy",
        socketId: { $ne: null },
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            $maxDistance: 5000
          }
        }
      });

      console.log("📡 Nearby delivery boys:", deliveryBoys.length);

      if (deliveryBoys.length === 0) {
        await order.save();
        return res.json({ message: "No delivery boys online" });
      }

      const assignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop._id,
        shopOrderId: shopOrder._id,
        broadcastedTo: deliveryBoys.map(b => b._id),
        status: "broadcasted"
      });

      shopOrder.assignment = assignment._id;
      await order.save();

      const io = req.app.get("io");

      deliveryBoys.forEach(boy => {
        console.log("📦 Sending assignment to:", boy._id);

        io.to(boy.socketId).emit("newAssignment", {
          assignmentId: assignment._id,
          shopName: shopOrder.shop.name,
          deliveryAddress: order.deliveryAddress,
          items: shopOrder.shopOrderItems,
          subtotal: shopOrder.subtotal
        });
      });
    }

    return res.json({ message: "Order moved to out for delivery" });

  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const getDeliveryBoyAssignment = async (req, res) => {
    try {
        const deliveryBoyId = req.userId
        const assignments = await DeliveryAssignment.find({
            broadcastedTo: deliveryBoyId,
            status: "broadcasted"
        })
            .populate("order")
            .populate("shop")

        const formated = assignments.map(a => ({
            assignmentId: a._id,
            orderId: a.order._id,
            shopName: a.shop.name,
            deliveryAddress: a.order.deliveryAddress,
            items: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId)).shopOrderItems || [],
            subtotal: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId))?.subtotal
        }))

        return res.status(200).json(formated)
    } catch (error) {
        return res.status(500).json({ message: `get Assignment error ${error}` })
    }
}


export const acceptOrder = async (req, res) => {
    try {
        const { assignmentId } = req.params
        const assignment = await DeliveryAssignment.findById(assignmentId)
        if (!assignment) {
            return res.status(400).json({ message: "assignment not found" })
        }
        if (assignment.status !== "broadcasted") {
            return res.status(400).json({ message: "assignment is expired" })
        }

        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: { $nin: ["broadcasted", "completed"] }
        })

        if (alreadyAssigned) {
            return res.status(400).json({ message: "You are already assigned to another order" })
        }

        assignment.assignedTo = req.userId
        assignment.status = 'assigned'
        assignment.acceptedAt = new Date()
        await assignment.save()

        const order = await Order.findById(assignment.order)
        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }

        let shopOrder = order.shopOrders.id(assignment.shopOrderId)
        shopOrder.assignedDeliveryBoy = req.userId
        await order.save()


        return res.status(200).json({
            message: 'order accepted'
        })
    } catch (error) {
        return res.status(500).json({ message: `accept order error ${error}` })
    }
}



export const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "assigned"
    })
      .populate("shop", "name")
      .populate("assignedTo", "fullName email mobile location")
      .populate({
        path: "order",
        populate: [{ path: "user", select: "fullName email location mobile" }]
      })

    // ✅ NO ACTIVE ORDER IS A VALID STATE
    if (!assignment || !assignment.order) {
      return res.status(200).json(null)
    }

    const shopOrder = assignment.order.shopOrders.find(
      so => String(so._id) === String(assignment.shopOrderId)
    )

    if (!shopOrder) {
      return res.status(200).json(null)
    }

    let deliveryBoyLocation = { lat: null, lon: null }
    if (assignment.assignedTo?.location?.coordinates?.length === 2) {
      deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1]
      deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0]
    }

    let customerLocation = { lat: null, lon: null }
    if (assignment.order.deliveryAddress) {
      customerLocation.lat = assignment.order.deliveryAddress.latitude
      customerLocation.lon = assignment.order.deliveryAddress.longitude
    }

    return res.status(200).json({
      _id: assignment.order._id,
      user: assignment.order.user,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation
    })

  } catch (error) {
    console.error("getCurrentOrder error:", error)
    return res.status(500).json({ message: error.message })
  }
}


export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findById(orderId)
            .populate("user")
            .populate({
                path: "shopOrders.shop",
                model: "Shop"
            })
            .populate({
                path: "shopOrders.assignedDeliveryBoy",
                model: "User"
            })
            .populate({
                path: "shopOrders.shopOrderItems.item",
                model: "Item"
            })
            .lean()

        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }
        return res.status(200).json(order)
    } catch (error) {
        return res.status(500).json({ message: `get by id order error ${error}` })
    }
}

export const sendDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body
        const order = await Order.findById(orderId).populate("user")
        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!order || !shopOrder) {
            return res.status(400).json({ message: "enter valid order/shopOrderid" })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        shopOrder.deliveryOtp = otp
        shopOrder.otpExpires = Date.now() + 5 * 60 * 1000
        await order.save()
        await sendDeliveryOtpMail(order.user, otp)
        return res.status(200).json({ message: `Otp sent Successfuly to ${order?.user?.fullName}` })
    } catch (error) {
        return res.status(500).json({ message: `delivery otp error ${error}` })
    }
}


// export const verifyDeliveryOtp = async (req, res) => {
//   try {
//     const { orderId, shopOrderId, otp } = req.body;

//     // 🔍 Find order
//     const order = await Order.findById(orderId).populate("user");
//     if (!order) {
//       return res.status(400).json({ message: "Order not found" });
//     }

//     // 🔍 Find shop order
//     const shopOrder = order.shopOrders.id(shopOrderId);
//     if (!shopOrder) {
//       return res.status(400).json({ message: "Shop order not found" });
//     }

//     // ❌ OTP validation
//     if (
//       shopOrder.deliveryOtp !== otp ||
//       !shopOrder.otpExpires ||
//       shopOrder.otpExpires < Date.now()
//     ) {
//       return res.status(400).json({ message: "Invalid or Expired OTP" });
//     }

//     // ✅ Mark delivered
//     shopOrder.status = "delivered";
//     shopOrder.deliveredAt = new Date();
//     shopOrder.deliveryOtp = null;
//     shopOrder.otpExpires = null;

//     await order.save();

//     // ✅ Update assignment → completed
//     const assignment = await DeliveryAssignment.findOne({
//       order: order._id,
//       shopOrderId: shopOrder._id,
//       assignedTo: shopOrder.assignedDeliveryBoy
//     });

//     if (assignment) {
//       assignment.status = "completed";
//       await assignment.save();
//     }

//     // 💰 UPDATE DELIVERY BOY EARNINGS
//     const DELIVERY_EARNING = 30; // ₹30 per delivery

//     await User.findByIdAndUpdate(
//       shopOrder.assignedDeliveryBoy,
//       { $inc: { earnings: DELIVERY_EARNING } }
//     );

//     return res.status(200).json({
//       message: "Order Delivered Successfully!",
//       earned: DELIVERY_EARNING
//     });

//   } catch (error) {
//     console.error("verifyDeliveryOtp error:", error);
//     return res.status(500).json({
//       message: "Verify delivery OTP error"
//     });
//   }
// };

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;
    const deliveryBoyId = req.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!shopOrder) {
      return res.status(400).json({ message: "Shop order not found" });
    }

    if (
      shopOrder.deliveryOtp !== otp ||
      !shopOrder.otpExpires ||
      shopOrder.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ CRITICAL FIX
    shopOrder.status = "delivered";
    shopOrder.deliveredAt = new Date();
    shopOrder.assignedDeliveryBoy = deliveryBoyId;

    await order.save();

    await DeliveryAssignment.deleteOne({
      shopOrderId: shopOrder._id,
      order: order._id,
      assignedTo: deliveryBoyId
    });

    return res.status(200).json({
      message: "Order Delivered Successfully!"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "verify delivery otp error"
    });
  }
};


// export const getTodayDeliveries=async (req,res) => {
//     try {
//         const deliveryBoyId=req.userId
//         const startsOfDay=new Date()
//         startsOfDay.setHours(0,0,0,0)

//         const orders=await Order.find({
//            "shopOrders.assignedDeliveryBoy":deliveryBoyId,
//            "shopOrders.status":"delivered",
//            "shopOrders.deliveredAt":{$gte:startsOfDay}
//         }).lean()

//      let todaysDeliveries=[] 
     
//      orders.forEach(order=>{
//         order.shopOrders.forEach(shopOrder=>{
//             if(shopOrder.assignedDeliveryBoy==deliveryBoyId &&
//                 shopOrder.status=="delivered" &&
//                 shopOrder.deliveredAt &&
//                 shopOrder.deliveredAt>=startsOfDay
//             ){
//                 todaysDeliveries.push(shopOrder)
//             }
//         })
//      })

// let stats={}

// todaysDeliveries.forEach(shopOrder=>{
//     const hour=new Date(shopOrder.deliveredAt).getHours()
//     stats[hour]=(stats[hour] || 0) + 1
// })

// let formattedStats=Object.keys(stats).map(hour=>({
//  hour:parseInt(hour),
//  count:stats[hour]   
// }))

// formattedStats.sort((a,b)=>a.hour-b.hour)

// return res.status(200).json(formattedStats)
  

//     } catch (error) {
//         return res.status(500).json({ message: `today deliveries error ${error}` }) 
//     }
// }

export const getTodayDeliveries = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      "shopOrders.assignedDeliveryBoy": deliveryBoyId,
      "shopOrders.status": "delivered",
      "shopOrders.deliveredAt": { $gte: startOfDay }
    }).lean();

    const stats = {};

    orders.forEach(order => {
      order.shopOrders.forEach(shopOrder => {
        if (
          shopOrder.assignedDeliveryBoy?.toString() === deliveryBoyId &&
          shopOrder.status === "delivered" &&
          shopOrder.deliveredAt &&
          new Date(shopOrder.deliveredAt) >= startOfDay
        ) {
          const hour = new Date(shopOrder.deliveredAt).getHours();
          stats[hour] = (stats[hour] || 0) + 1;
        }
      });
    });

    const formattedStats = Object.keys(stats)
      .map(hour => ({
        hour: Number(hour),
        count: stats[hour]
      }))
      .sort((a, b) => a.hour - b.hour);

    return res.status(200).json(formattedStats);

  } catch (error) {
    console.error("getTodayDeliveries error:", error);
    return res.status(500).json({ message: "Today deliveries error" });
  }
};
