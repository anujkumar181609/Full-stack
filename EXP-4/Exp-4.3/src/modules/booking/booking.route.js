import express from "express";
const router = express.Router();

router.post("/book/:id", (req, res) => {
    res.json({ message: "Booking successful" });
});

export default router;
