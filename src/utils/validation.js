const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailID, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name cannot be empty");
  } else if (!validator.isEmail(emailID)) {
    throw new Error("EmailID is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

module.exports = {
  validateSignUpData,
};
