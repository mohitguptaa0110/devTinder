const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting checked!!");
  const token = "xyz";
  const isAdinAuthorized = token === "xyz";
  if (!isAdinAuthorized) {
    res.status(401).send("Unauthorized rerquest");
  } else {
    next();
  }
};
const userAuth = (req, res, next) => {
  console.log("User auth is getting checked!!");
  const token = "xyz";
  const isAdinAuthorized = token === "xyz";
  if (!isAdinAuthorized) {
    res.status(401).send("Unauthorized rerquest");
  } else {
    next();
  }
};

module.exports = { adminAuth , userAuth};
