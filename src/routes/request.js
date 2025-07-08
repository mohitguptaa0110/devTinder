const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status is invalid!" });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found" });
      }
      const existingConnectionRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request already exist!" });
      }

      const connection = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connection.save();
      res.json({
        message: "Connection request sent successfully",
        data,
      });
    } catch (err) {
      res.status(400).send("Error :" + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      // check the allowed status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!" });
      }
      // check for the connection request
      const connection = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connection) {
        return res
          .status(404)
          .json({ message: "Connection request not found!" });
      }
      connection.status = status;
      const data = await connection.save();

      res.json({ message: "Connection request : " + status, data });
    } catch (err) {
      res.status(400).send("Error :" + err.message);
    }
  }
);
module.exports = requestRouter;
