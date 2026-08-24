import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
import authRoutes from "./routes/auth.js";


app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Student Task Manager Backend is running!");
});

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });