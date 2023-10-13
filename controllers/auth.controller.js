const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { resetPasswordTemplate } = require('../utils/emailTemplates');
const { sendMail } = require('../utils/sendMail');

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "Please fill all information!" });

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists! Login Instead" });
  }

  const user = new User({
    username,
    email,
    password,
  });

  await user.save((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    } else {
      res.status(200).json(user);
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    //Token generate
    const accessToken = generateAccessToken(user);
    res.cookie("token", accessToken, {
      httpOnly: process.env.NODE_ENV === "production" ? false : true, 
      secure: process.env.NODE_ENV === "production" ? true : false, 
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
      maxAge: 30 * ( 1000 * 60 * 60 * 24)
    });
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      pic: user.pic,
    });
  } else {
    res.status(404).send({ message: "Invalid Email or Password!" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, oldPassword, password } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (user) {
      user.username = username || user.username;

      if (password) {
        const passwordValid = await user.matchPassword(
          oldPassword,
          user.password
        );
        if (!passwordValid) {
          return res
            .status(400)
            .send({ message: "Please enter correct old password" });
        }
        user.password = password || user.password;
      }
    }

    const updatedUser = await user.save();
    const accessToken = generateAccessToken(updatedUser);
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      pic: updatedUser.pic,
      accessToken,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json("Logged out!");
};

//Reset password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email }).populate("password");
  if (!user) {
    res.status(404).send({ message: "User not registered!" });
  }
  const secret = process.env.JWT_SECRET + user.password;
  const payload = {
    _id: user._id,
    email: user.email,
  };
  const forgotPasswordToken = jwt.sign(payload, secret, { expiresIn: "15m" });
  const gmail = process.env.GMAIL
  const emailTemplate = resetPasswordTemplate(email,user._id,forgotPasswordToken,gmail);
  sendMail(emailTemplate)
};

const resetPassword = async (req, res) => {
  try {
    const { userId, forgotPasswordToken } = req.params;
    const { password } = req.body;

    const user = await User.findById(userId).select("+password");
    const convertUser = JSON.parse(JSON.stringify(user))
    
    if (userId !== convertUser._id) return;
    const secret = process.env.JWT_SECRET + user.password;
    const payload = jwt.verify(forgotPasswordToken, secret);

    user.password = password || user.password;
    const updatedUser = await user.save();
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.send(error.message);
  }
};
module.exports = {
  generateAccessToken,
  updateUser,
  logout,
  login,
  register,
  forgotPassword,
  resetPassword,
};
