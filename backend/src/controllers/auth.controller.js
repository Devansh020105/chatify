import { sendWelcomeEmail } from "../emails/emailHandler.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {ENV} from "../lib/env.js"
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res)=>{
    const {fullName, email, password} = req.body

    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }

        //check if email is valid : regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "invalid email format"});
        }

        //checking if uswer already have a account by checking if we have same email already registered
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message:"Email already exists"})

        //123456 => $lajeFKAJBFKABEJNEcI

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if(newUser){
            // await newUser.save();
            // generateToken(newUser._id, res);

            const savedUser = await newUser.save();
            generateToken(savedUser._id,res);

            res.status(201).json({  // 200 means success and 201 means something created succesfully 
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic || "",
            });

            //todo: send a welcome email to the user !

            try{
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            } catch (error){
                console.error("Failed to send welcome email:", error)
            }
        } else{
            res.status(400).json({message: "Invalid user data"});
        }
    } catch (error){
        console.log("Enter in signup controller:", error);
        res.status(500).json({message: "Internal server error"});
    }
};


export const login = async (req,res) => {
    const {email,password} = req.body

    if(!email || !password){
        return res.status(400).json({ message: "Email and password required"});
    }

    try {
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: "Invalid credentials"})
    
        const ifPasswordCorrect = await bcrypt.compare(password,user.password)
        if(!ifPasswordCorrect) return res.status(400).json({ message: "Invalid credentials"});
    
        generateToken(user._id,res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error in login controller:",error)
        res.status(500).json({message:"Internal server error"})
    }
};


export const logout = async (_, res) => {
    res.cookie("jwt", "",{maxAge: 0}) 
    res.status(200).json({message: "Logged out successfully"})
};

export const updateProfile = async (req, res) => {
    try {
        const{profilePic} = req.body;
        if(!profilePic) return res.status(400).json({message:"Profile pic is required"});

        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        await User.findByIdAndUpdate(userId,{profilePic: uploadResponse.secure_url},{new : true});

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update profile:",error);
        res.status(500).json({message: "Internal server error"})
    }
}


