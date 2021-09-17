const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requirelogin = require("../middleware/requirelogin");
router.get("/", (req, res) => {
  res.send("hello");
});

router.get("/protect", requirelogin, (req, res) => {
  res.send("hey hey");
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Pls add all the fields" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser)
      return res.status(422).json({ error: "User alredy exisits" });
  });
  bcrypt.hash(password, 12).then((hased) => {
    const user = new User({ email, password: hased, name });
    user
      .save()
      .then((user) => res.json({ message: hased }))
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(422).json({ error: "Add all the field" });

  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) return res.status(422).json({ error: "User not found" });
    bcrypt.compare(password, savedUser.password).then((match) => {
      if (match) {
        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
        const { _id, name, email } = savedUser;
        return res.json({ token, user: { _id, name, email } });
      } else {
        return res.json({ error: "not matched" });
      }
    });
  });
});
module.exports = router;
