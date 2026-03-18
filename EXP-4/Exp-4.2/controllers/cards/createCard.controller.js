import CardModel from "../../models/card.js";

export const createCard = async (req, res) => {
  const { name, suit } = req.body;

  try {
    const newCard = new CardModel({ name, suit });
    const savedCard = await newCard.save();

    res.status(201).json({
      message: "Card created successfully",
      card: savedCard
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
