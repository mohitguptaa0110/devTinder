const express = require("express");
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const { validateEditProfileData } = require("../utils/validation");
const validator = require("validator")

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} , your data is updated successfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { currentPassword, newPassword } = req.body;
    // Validate input
    if (!currentPassword || !newPassword) {
      throw new Error("Both current and new password are required");
    }

    // compare it with user current password
    const isMatch = await bcrypt.compare(currentPassword, loggedInUser.password);

    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    //validate newPasswors is strong or not
    if(!validator.isStrongPassword(newPassword)){
      throw new Error("Your password is not strong")
    }

    // update the password
    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    await loggedInUser.save();

     res.json({
      message: "Password updated successfully!",
    });

  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});
module.exports = profileRouter;
