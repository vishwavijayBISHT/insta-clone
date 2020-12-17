const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requirelogin");
const nodemailer = require("nodemailer");
const transport = require("nodemailer-sendgrid-transport");
//give user a token with the help of it user can acces protected resoces
const transporter = nodemailer.createTransport(
  transport({
    auth: {
      api_key:
        "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",
    },
  })
);
router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "pls" });
  }

  User.findOne({ email: email })
    .then((saveUser) => {
      if (saveUser) {
        return res.status(422).json({ error: "user already exixt" });
      }
      bcrypt.hash(password, 12).then((hasedpassword) => {
        const user = new User({
          email: email,
          password: hasedpassword,
          name,
          pic: pic,
        });
        user
          .save()
          .then((user) => {
            transporter.sendMail({
              to: user.email,
              from: "no-reply@insta.com",
              subject: "sign success",
              html: "<h1>Welcome to Insta</h1>",
            });
            res.json({ massage: "saved" });
          })
          .catch((err) => {
            console.log("errorlogin");
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(442).json({ error: "add emial or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "invalid emial or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, pic } = savedUser;
          res.json({ token: token, user: { _id, name, email, pic } });
          // return res.json({massage:"sucufully signed in"})
        } else {
          return res.status(422).json({ error: "invalid emial or password" });
        }
      })
      .catch((err) => {
        console.log("err");
      });
  });
});

router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(422).json({ error: "user dont exixt" });
      }
      user.resetToken = token;
      user.expiredate = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "no-reply@insta.com",
          subject: "password reset",
          html: `<p> you requested for passs word reset</p>
          <h5> click on this<a href="http://localhost:300/reset/${token}"> link<a/> to reset</h5>
          
          `,
        });
        res.json({ message: "check your emial" });
      });
    });
  });
});

router.post("/newpass", (req, res) => {
  const newpass = req.body.password;
  const sent = req.body.token;
  User.findOne({ resetToken: sent, expiredate: { $gt: Date.now() } }).then(
    (user) => {
      if (!user) {
        return res.status(422).json({ error: "try again sessoon expired" });
      }
      bcrypt
        .hash(newpass, 12)
        .then((hashedpass) => {
          user.password = hashedpass;
          user.resetToken = undefined;
          user.expiredate = undefined;
          user.save().then((saved) => {
            res.json({ message: "password updated" });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  );
});
// router.get('/protected',requireLogin,(req,res)=>{
// res.send("hello user")

// })

module.exports = router;
//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
