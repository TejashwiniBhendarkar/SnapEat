import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import getToken from "../utils/token.js"

export const signUp = async(req,res) =>{
    try {
        const {fullName,email,password,mobile,role} = req.body
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message:"User Already Exist"})
        }
        if(password.length<8){
            return res.status(400).json({message:"Password must be at least 8 characters"})
        }
        if(mobile.length<10){
            return res.status(400).json({message:"Mobile No. must be of 10 digits"})
        }

        const hashedPassword = await bcrypt.hash(password,10)
        user = await User.create({
            fullName,
            email,
            mobile,
            role,
            password:hashedPassword
        })
        const token = await getToken(user._id)
        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
        return res.status(400).json(user)

    } catch (error) {
         return res.status(500).json(`signup error ${error}`)
    }
}

export const signIn = async(req,res) =>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User does not Exist"})
        }
      
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Incorrect password"})
        }

        const token = await getToken(user._id)
        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
        return res.status(200).json(user)

    } catch (error) {
         return res.status(500).json(`signin error ${error}`)
    }
}

export const signOut = async(req,res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"logout successfully"})
    } catch (error) {
        return res.status(500).json(`logout error ${error}`)
    }
}