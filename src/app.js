const express = require("express");
const connectDB = require("./config/database");
const app = express();
const { adminAuth } = require("./middlewares/auth");
const User = require("./models/user");
// Order matters--------------

// USE IS USED TO MAP ALL HTTP METHODS API CALLS
// app.use("/",(req,res) => {
//     res.send("Talking from the server!")
// })

// app.get("/user", (req,res) => {
//     res.send({firstName : "Mohit" , lastName : "Gupta"})
// })
// app.post("/user", (req,res) => {
//     res.send("Data Successfully saved to database")
// })
// app.delete("/user", (req,res) => {
//     res.send("Deleted Successfully")
// })
// app.put("/user", (req,res) => {
//     res.send("Updated Successfully")
// })

// app.get(/^\/ab?c$/, (req, res) => {
//   // ab?c , ab+c
//   res.send({ firstName: "Mohit", lastName: "Gupta" });
// });

// // Query Params --->
// app.get("/user", (req, res) => {
//   //http://localhost:3000/user?userId=101&password=1234
//   console.log(req.query);
//   res.send("Updated Successfully");
// });

// // Route Params-------->
// app.get("/user/:userId", (req, res) => {
//   //http://localhost:3000/user/704
//   console.log(req.params);
//   res.send("Updated Successfully");
// });

// // multiple routes handler and Middleware
// app.use("/", (req, res,next) => {
//   // res.send("hey")
//   next();
// });
// app.use(
//   "/example", // route
//   (req, res, next) => {
//     // this function is called route handler
//     // res.send("Response 1!");  --> if undo it prints response 1 and gives error in console bcz another response we tried to send
//     next();
//   },
//   (req, res) => {
//     res.send("Response 2!");
//   }
// );

// // Handle Auth Middleware for all GET, POST,.....requests
// app.use("/admin", adminAuth);
// app.get("/admin/getAllData", (req, res) => {
//   res.send("User data Sent");
// });
// app.get("/admin/deleteAllData", (req, res) => {
//   res.send("Data deleted");
// });
// app.get("/user/getdata", (req, res) => {
//   res.send("received from user data");
// });

// app.get("/getUserData", (req, res) => {
//   // throw new Error("gdgbsfb");
//   // res.send("User data sent");
//   try {
//     throw new Error("gdgbsfb");
//     res.send("User data sent");
//   } catch (err) {
//     res.status(500).send("Some error occurred");
//   }
// });
// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(500).send("something went wrong");
//   }
// });

app.use(express.json());
//It is a middleware to convert json into js object

// get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailID;

  try {
    const users = await User.find({ emailID: userEmail });
    if (users.length == 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wronng");
  }
});

//FEED API - get all the users from database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wronng");
  }
});

// Delete a user from database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    // const user = await User.findByIdAndDelete(userId);
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wronng");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
    });
    console.log(user);
    res.send("Data is updated");
  } catch (err) {
    res.status(400).send("Something went wronng");
  }
});
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

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
