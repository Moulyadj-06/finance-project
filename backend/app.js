import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import recordRoutes from "./routes/recordRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js";


const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;