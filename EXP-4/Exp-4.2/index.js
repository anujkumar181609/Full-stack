import express from "express";
import { connectDB } from "./config/db.js";
import cardRoutes from "./routes/cards.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/cards", cardRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Playing Card API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
