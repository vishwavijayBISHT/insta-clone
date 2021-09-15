const express = require("express");
const app = express();
const PORT = 5000;

// app.use() this is how to use middle ware

app.get("/", (req, res) => {
  res.send("yo");
});

app.listen(PORT, () => {
  console.log("server is running");
});
