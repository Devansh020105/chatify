import jwt from "jsonwebtoken";
import { ENV } from "./env";

export const generateToken = (userId,res)=>{
    const{JWT_SECRET,NODE_ENV} = ENV;
    if(!JWT_SECRET){
        throw new Error("JWT_SECRET is not configured");
    }
    //create a token for a user
    const token = jwt.sign({userId}, JWT_SECRET,{
        expiresIn: "15d",
    });

res.cookie("jwt",token,{
    maxAge: 7*24*60*60*1000,
    httpOnly: true, // prevents XSS attacks: cross-site scripting
    sameSite: "strict", //CSRF attacks
    secure: ENV.NODE_ENV === "development" ? false : true,
});

return token;

};