const User = require('../models/user');

exports.getBalance = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ balance: user.balance });
};