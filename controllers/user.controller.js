const User = require("../models/user");
const bcrypt = require("bcrypt");

const searchUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        email: { $regex: req.query.search, $options: "i" },
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    return res.status(200).json({ message: "Delete Successfully" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  searchUser,
  deleteUser,
};
