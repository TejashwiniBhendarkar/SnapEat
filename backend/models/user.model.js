import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: String,
    mobile: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "owner", "deliveryBoy"],
      required: true
    },
    resetOtp: String,
    isOtpVerified: {
      type: Boolean,
      default: false
    },
    otpExpires: Date,
    socketId: {
      type: String,
      default: null
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    earnings: {
  type: Number,
  default: 0
},


    // ✅ LOCATION EXISTS ONLY IF SET
    location: {
      type: {
        type: String,
        enum: ["Point"]
      },
      coordinates: {
        type: [Number] // [lng, lat]
      }
    }
  },
  { timestamps: true }
);

// ✅ Index still exists
userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);
export default User;

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true
//     },
//     password: {
//       type: String
//     },
//     mobile: {
//       type: String,
//       required: true
//     },
//     role: {
//       type: String,
//       enum: ["user", "owner", "deliveryBoy"],
//       required: true
//     },
//     resetOtp: {
//       type: String
//     },
//     isOtpVerified: {
//       type: Boolean,
//       default: false
//     },
//     otpExpires: {
//       type: Date
//     },
//     socketId: {
//       type: String,
//       default: null
//     },
//     isOnline: {
//       type: Boolean,
//       default: false
//     },

//     // ✅ GEO LOCATION (VERY IMPORTANT)
//     location: {
//       type: {
//         type: String,
//         enum: ["Point"],
//         default: "Point"
//       },
//       coordinates: {
//         type: [Number], // [longitude, latitude]
//         default: undefined // ❗ IMPORTANT FIX
//       }
//     }
//   },
//   { timestamps: true }
// );

// // ✅ REQUIRED FOR $near
// userSchema.index({ location: "2dsphere" });

// const User = mongoose.model("User", userSchema);
// export default User;
