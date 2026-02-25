import User from "../models/User.js"
import { formatJoiErrors } from "../utils/FormatJoiErrors.js"
import { loginValidation, registerValidaton } from "../validations/AuthenticationValidations.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    //1. validation
    const {error} = registerValidaton.validate(req.body, {abortEarly: false})

    if(error){
        //mapping errornya
        const errors = formatJoiErrors(error)
        return res.status(400).json({
            message: "Validation error",
            errors,
        })
    }

    try{
        const {name, email, password} = req.body
        console.log(name, email, password)
        //cek email sudah ada
        const existstingUser = await User.findOne({email})
        if(existstingUser){
            return res.status(400).json({
                message: "Email already exists"
            })
        }

        const user = new User({name, email, password})
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        await user.save()

        return res.status(201).json({
            message:"User created successfully, please wait you are being redirected to login page",
            user,
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const login = async (req, res) => {
    const {error} = loginValidation.validate(req.body, {abortEarly: false})

    if(error){
        const errors = formatJoiErrors(error)
        return res.status(400).json({
            message: "Validation error",
            errors
        })
    }

    const {email, password} = req.body
    try{
        //1. cek email ada atau tidak
        const user = await User.findOne({ email })
        
        if(!user){
            return res.status(400).json({
                message: "Email or password is incorrect"
            })
        }

        //2. cek pwnya bedan atau tidak
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({
                message: "Email or password is incorrect"
            })
        }

        //3. bikin token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})

        //4. buat cookie untuk user
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })

        //5. redirect ke halaman dashboard
        return res.status(200).json({
            message: "Login successfully, please wait you are being redirected to Dashboard",
            user,
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const whoami = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password")
        return res.status(200).json({
            user,
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const logout = async (req, res) => {
    try{
        res.clearCookie("token")
        return res.status(200).json({
            message: "Logout successfully, please wait you are being redirected to login page"
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}