const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Re = mongoose.model("RE");

router.get("/configdata", (req, res) => {
  // return res.status(422).json({ error: "pls" });'
  console.log(req.body);
  return res.json(req.body);
});

module.exports = router;
