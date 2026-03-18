import express from "express";
import { createCard } from "../controllers/cards/createCard.controller.js";

const router = express.Router();

router.post("/", createCard);

export default router;

