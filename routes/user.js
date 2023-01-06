const express = require("express");
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const { body, validationResult } = require("express-validator");
const { User, Contact } = require("../models/contactSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const router = express.Router();
router.use(body_parser.json());


router.get('/login',(req,res) => {
  res.send({
      status: "Success",
      message: "USERS route is Working"
  })
})

//-------------------------------------------------------------------------------------------------------------------------------------
router.post(
  "/signup",
  body("Email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(406).json({
          errors: errors.array(),
          status: 400,
          message: "Enter a Valid Email ID"
        });
      }
      const { Email, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return res.status(407).json({
          status: "Failed",
          message: "Confirm Password does not match"
        })
      }

      const user_Email = await User.findOne({ Email: Email });
      if (user_Email) {
        return res.status(408).json({
          status: "Failed",
          message: "Email already Exist",
        });
      }
      bcrypt.hash(password, 10, async function (err, hash) {
        if (err) {
          return res.status(500).json({
            status: "Failed",
            message: err.message,
          });
        }
        const user = await User.create({
          Email: Email,
          password: hash,
          // confirmPassword: hash,
        });
        res.status(200).json({
          status: "Success",
          user: user,
        });
      });
    } catch (e) {
      res.status(409).json({
        status: "Failed",
        message: e.message,
      });
    }
  }
);

// -------------------------------------------------------------------------------------------------------------------------------------

router.post("/login", async (req, res) => {
  try {
    const { Email, password } = req.body;
    const user = await User.findOne({ Email: Email });
    if (!user) {
      return res.status(401).json({
        status: "Failed",
        message: "Email does NOT Exist, Please Sign UP",
      });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res.status(402).json({
          status: "Failed",
          message: err,
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: user._id,
          },
          secret
        );


        console.log(user);


        return res.status(200).json({
          status: "Success",
          message: "Login Successful",
          token,
        });
      } else {
        res.status(403).json({
          status: "Failed",
          message: "Password Incorrect",
        });
      }
    });
  } catch (e) {
    res.status(404).json({
      status: "Failed",
      message: e.message,
    });
  }
});

module.exports = router;