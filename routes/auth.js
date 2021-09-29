const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const pdfTemplate = require("./pdftem");
var html_to_pdf = require("html-pdf-node");
const requirelogin = require("../middleware/requirelogin");
const fs = require("fs");
const nodemailer = require("nodemailer");
router.get("/", (req, res) => {
  res.send("hello");
});

router.get("/protect", requirelogin, (req, res) => {
  res.send("hey hey");
});

router.post("/signup", async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Pls add all the fields" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser)
      return res.status(422).json({ error: "User alredy exisits" });
  });
  let options = {
    format: "A4",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    path: `C:\Users\TCZ-NISHU\Desktop\myprojects\insta\server\pdf`,
  };
  let file = [{ url: "", name: "example.pdf" }];

  bcrypt.hash(password, 12).then((hased) => {
    const user = new User({ email, password: hased, name, pic });
    user
      .save()
      .then((user) => res.json({ message: hased }))
      .catch((err) => {
        console.log(err);
      });
  });

  const pdf = await html_to_pdf.generatePdf(
    { url: "", content: pdfTemplate(name, email, pic), name: "example.pdf" },
    options
  );
  const ok = await fs.writeFile(`${name}.pdf`, pdf, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vishwavijay.bisht@techchefz.com",
      pass: "indian123",
    },
  });

  const mailOptions = {
    from: "vishwavijay.bisht@techchefz.com",
    to: email,
    subject: "Welcome to Instagram clone",
    text: "Enjoy the Platform",
    attachments: [
      {
        filename: `${name}.pdf`,
        content: new Buffer.from(pdf, "utf-8"),
        contentType: "application/pdf",
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: " + info.response);
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
        const { _id, name, email, followers, following, pic } = savedUser;
        return res.json({
          token,
          user: { _id, name, email, followers, following, pic },
        });
      } else {
        return res.json({ error: "not matched" });
      }
    });
  });
});
module.exports = router;
