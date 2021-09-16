const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requirelogin = require("../middleware/requirelogin");
const Post = mongoose.model("Post");

router.post("/createPost", requirelogin, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(401).json({ message: "Pls add fileds" });
  }

  const post = new Post({
    title,
    body,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;