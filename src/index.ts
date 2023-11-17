import express from "express";
import dotenv from "dotenv";

dotenv.config();
import authRoutes from "./routes/authRotes";
const app = express();

// Middlewares

app.use(express.json());
app.use("/auth", authRoutes);

app.listen(3000, () => console.log("Server Strated"));
