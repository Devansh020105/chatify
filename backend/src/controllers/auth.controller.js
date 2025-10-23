import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
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
            await newUser.save();
            generateToken(newUser._id, res);

            res.status(201).json({  // 200 means success and 201 means something created succesfully 
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic || "",
            });

            //todo: send a welcome email to the user !
        } else{
            res.status(400).json({message: "Invalid user data"});
        }
    } catch (error){
        console.log("Enter in signup controller:", error);
        res.status(500).json({message: "Internal server error"});
    }
};