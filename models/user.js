const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSCHEMA = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  pic: { type: String },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
  resetToken: { type: String },
  expiredate: { type: Date },
});

mongoose.model("User", userSCHEMA);
