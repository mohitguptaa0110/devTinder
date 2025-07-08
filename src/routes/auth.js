const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    const { password, ...rest } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      ...rest,
      password: passwordHash,
    });

    // create new instance of User model
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;
    // validate the email
    if (!validator.isEmail(emailID)) {
      throw new Error("Email Id is not correct");
    }
    // find the email that is asked in database
    const user = await User.findOne({ emailID: emailID });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    //compare the password
    const isPasswordValid = await user.validatePassword(password); // it returns true or false
    if (isPasswordValid) {
      // Create a JWT Token
      const token = await user.getJWT();

      //Add token to cookie and sent response back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successfully!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successfully")
});

module.exports = authRouter;
