import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
    try {
        // ✅ READ TOKEN FROM COOKIE
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        req.userId = user._id;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default isAuth;

// import jwt from "jsonwebtoken";

// const isAuth = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({ message: "Token missing" });
//         }

//         const token = authHeader.split(" ")[1];
//         const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

//         if (!decodeToken) {
//             return res.status(401).json({ message: "Token invalid" });
//         }

//         req.userId = decodeToken.userId;
//         next();

//     } catch (error) {
//         return res.status(500).json({ message: "isAuth error: " + error.message });
//     }
// };

// export default isAuth;
