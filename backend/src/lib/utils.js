import jwt from "jsonwebtoken";

export const generateToken = (userId,res)=>{
    const{JWT_SECRET,NODE_ENV} = process.env;
    if(!JWT_SECRET){
        throw new Error("JWT_SCCRET is not configured");
    }
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