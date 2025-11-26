import express from "express"
import { signIn, signOut, signUp } from "../controllers/auth.controllers"

const authRouter = express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)
authRouter.get("/signout",signOut)