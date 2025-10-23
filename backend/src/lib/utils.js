import jwt from "jsonwebtoken";

export const generateToken = (userId,res)=>{
    //create a token for a user
    const token = jwt.sign({userid},process.env.JWT_SECRET,{
        dexpiresIn: "7d",
    });

res.cookie("jwt",token,{
    maxAge: 7*24*60*60*1000,
    httpOnly: true, // prevents XSS attacks: cross-site scripting
    sameSite: "strict", //CSRF attacks
    secore: process.env.NODE_ENV === "development" ? false : true,
});

return token;

};