import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import healthRoutes from "./routes/health.js";
import messageRoutes from "./routes/message.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(helmet());
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", messageRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
