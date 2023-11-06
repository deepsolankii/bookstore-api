const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { email, password, name } = req.body;
    let user = await User.findOne({ email });
    if (user)
      return res.status(409).send({ message: "User already registered." });
    const hasedPassword = await bcrypt.hash(password, 12);
    user = new User({
      email,
      password: hasedPassword,
      name,
    });
    await user.save();
    return res.status(201).send({
      message: "User Registered Successfully",
      user: {
        userId: user._id,
        email: user.email,
        name,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).send({ message: "Invalid email or password." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send({ message: "Invalid password." });

    const token = jwt.sign(
      { userId: user._id.toString(), email },
      JWT_SECRET_KEY
    );
    res
      .status(200)
      .send({ token, message: "Login successful.", isLoggedIn: true });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};
