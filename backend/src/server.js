import dotenv from 'dotenv';
dotenv.config();
console.log("SERVER AUTH KEY CHECK:", process.env.CLOUDINARY_API_KEY);
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';  // <-- NEW IMPORT
import { dirname } from 'path';      // <-- NEW IMPORT
import cors from "cors";

import authRoutes from "./routes/auth.rout.js"
import messageRoutes from "./routes/message.rout.js"
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from './lib/socket.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const frontend_dist_path = path.join(__dirname, '..', '..', 'frontend', 'dist');

const PORT = ENV.PORT || 3000;

//payload too large error
app.use(express.json({ limit: '5mb' })) ;//req.body
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({origin:ENV.CLIENT_URL, credentials:true}))
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//make ready or for deployment
if(ENV.NODE_ENV === "production"){
    app.use(express.static(frontend_dist_path))

    app.get("*",(req,res) => {
        res.sendFile(path.join(frontend_dist_path,"index.html"));
    })
}
server.listen(PORT, () => {
    console.log("Server running on port: "+ PORT)
    connectDB();
});