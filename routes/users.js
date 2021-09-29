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

const follow = async (req, res) => {
  try {
    const followuser = await User.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    );

    const followinguser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.followId },
      },
      { new: true }
    );

    res.json({ follower: followuser, following: followinguser });
  } catch (err) {
    res.json({ error: "not able to folow" });
  }
};

const unfollow = async (req, res) => {
  try {
    const followuser = await User.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.followId },
      },
      { new: true }
    );

    res.json({ follower: followuser, following: followinguser });
  } catch (err) {
    res.json({ error: "not able to unfollow" });
  }
};

router.put("/follow", requirelogin, follow);
router.put("/unfollow", requirelogin, unfollow);

router.put("/updatepic", requirelogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic canot post" });
      }
      res.json(result);
    }
  );
});

router.post("/search-users", (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  User.find({ email: { $regex: userPattern } })
    .select("_id email")
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
