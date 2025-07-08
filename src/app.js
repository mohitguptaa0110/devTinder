const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
  
app.use(express.json());
app.use(cookieParser());
//It is a middleware to convert json into js object

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
connectDB()
  .then(() => {
    console.log("Database is successfully connected");
    app.listen(3000, () => {
      console.log("Server is successfull listening on port 3000....");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
