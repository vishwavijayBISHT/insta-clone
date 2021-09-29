const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: true,
  },
  email: {
    type: "String",
    required: true,
  },
  password: {
    type: "String",
    required: true,
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
  pic: {
    type: "String",
    default:
      "https://www.iconfinder.com/icons/2415477/female_link_user_users_icon",
  },
});

mongoose.model("User", userSchema);
