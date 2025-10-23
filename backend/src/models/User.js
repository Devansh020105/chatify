import mongoose, { mongo } from "mongoose";


const userSchema = new mongoose.Schema({ // creating schema
    email:{
        type: String,
        required: true,
        unique: true,
    },
    fullName:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        minlength:6
    },
    profilePic:{
        type: String,
        default: "",
    },
  },
    {timestamps: true} // createdAt & updateAt
); 

const User = mongoose.model("User", userSchema)   //create a user model based on the schema we created

export default User;





