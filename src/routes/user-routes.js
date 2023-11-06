const express = require("express");

const { body } = require("express-validator");

const authController = require("../controllers/user-controller");

const router = express.Router();

router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter valid Email.")
      .normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("name").notEmpty().trim(),
  ],
  authController.register
);

router.post("/login", authController.login);

module.exports = router;
