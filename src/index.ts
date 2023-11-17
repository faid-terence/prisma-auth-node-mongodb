import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRotes";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  await prisma.$connect();
  console.log("DB Connected Successfull......");
};

app.use(express.json());
app.use("/auth", authRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server Switched ON at port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

startServer();
