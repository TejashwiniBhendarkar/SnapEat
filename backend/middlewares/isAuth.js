import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token missing" });
        }

        const token = authHeader.split(" ")[1];
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodeToken) {
            return res.status(401).json({ message: "Token invalid" });
        }

        req.userId = decodeToken.userId;
        next();

    } catch (error) {
        return res.status(500).json({ message: "isAuth error: " + error.message });
    }
};

export default isAuth;
