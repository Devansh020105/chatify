import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.rout.js"
import messageRoutes from "./routes/message.rout.js"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => console.log("Server is runing on port : "+ PORT));