import express from "express";
import cors from "cors";
import env from "./config/env.js"; // Import the strict config loader

const app = express();
const port = env.PORT || 5000;

app.use(cors({
    origin: env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

import authRoutes from "./routes/auth.js";
import circuitRoutes from "./routes/circuit.js";
import oopjRoutes from "./modules/oopj/routes.js";

import mongoose from "mongoose";

// ... existing auth import

app.use("/api/auth", authRoutes);
app.use("/api/circuits", circuitRoutes);
app.use("/api/v1/oopj", oopjRoutes);


// Connect to MongoDB
mongoose.connect(env.MONGO_URI || "mongodb://localhost:27017/prayukti-vlab")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
    res.json({ message: "Prayukti vLAB API is running" });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
