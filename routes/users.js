const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requirelogin = require("../middleware/requirelogin");
const User = mongoose.model("User");
const Post = mongoose.model("Post");

const finduser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    const post = await Post.find({ postedby: req.params.id })
      .populate("postedby", "_id name")
      .exec();
    console.log(post);
    res.json({ user, post });
  } catch (err) {
    res.json({ error: "no user" });
  }
};

router.get("/users/:id", requirelogin, finduser);

module.exports = router;
