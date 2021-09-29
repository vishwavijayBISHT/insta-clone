const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requirelogin = require("../middleware/requirelogin");
const Post = mongoose.model("Post");

router.post("/createPost", requirelogin, (req, res) => {
  const { title, body, url } = req.body;
  if (!title || !body) {
    return res.status(401).json({ message: "Pls add fileds" });
  }

  const post = new Post({
    title,
    body,
    photo: url,
    postedby: req.user,
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

const getAllPost = async (req, res) => {
  try {
    const allpost = await Post.find().populate("postedby", "_id name");
    res.json({ post: allpost });
  } catch (err) {
    console.log(err);
  }
};

router.get("/allpost", getAllPost);

const userAllPost = async (req, res) => {
  try {
    const id = req.user._id;
    const allpost = await Post.find({ postedby: id }).populate(
      "postedby",
      "_id name"
    );
    if (allpost) return res.json({ post: allpost, user: req.user });
    else return res, json({ error: "no post found" });
  } catch (err) {
    console.log(err);
  }
};
router.get("/myposts", requirelogin, userAllPost);

const likes = async (req, res) => {
  try {
    console.log(req.body.postId);
    const post = await Post.findByIdAndUpdate(
      req.body.postid,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    ).exec();
    console.log(post);

    res.json(post);
  } catch (err) {
    res.json({ error: "not liked" });
  }
};
const unlikes = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body.postid,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    ).exec();
    res.json(post);
  } catch (err) {
    res.json({ error: "nnot unliked" });
  }
};

const comment = async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedby: req.user._id,
    };
    const commenting = await Post.findByIdAndUpdate(
      req.body.postid,
      {
        $push: { comments: comment },
      },
      { new: true }
    )
      .populate("comments.postedby", "_id name")
      .exec();

    res.json(commenting);
  } catch (err) {
    console.log(err);
    res.json({ error: "no comment" });
  }
};

const deletepost = async (req, res) => {
  try {
    const data = await Post.findOne({ _id: req.params.postid })
      .populate("postedby", "_id name")
      .exec();

    if (data.postedby._id.toString() === req.user._id.toString()) {
      const data2 = await data.remove();
      res.json({ message: "deleted" });
    }
  } catch (err) {
    res.json({ error: "no delete" });
  }
};

router.put("/like", requirelogin, likes);
router.put("/unlike", requirelogin, unlikes);
router.put("/comment", requirelogin, comment);
router.delete("/deletepost/:postid", requirelogin, deletepost);

const getsubPost = async (req, res) => {
  try {
    const allpost = await Post.find({
      postedby: { $in: req.user.following },
    }).populate("postedby", "_id name");
    res.json({ post: allpost });
  } catch (err) {
    console.log(err);
  }
};

router.get("/getsubpost", requirelogin, getsubPost);

module.exports = router;
