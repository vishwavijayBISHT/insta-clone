const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGO_URI } = require("./keys");
const PORT = 5000;
app.use(express.json());
require("./Schema/user");

app.use(require("./routes/auth"));

mongoose.connect(MONGO_URI);
mongoose.connection.on("connected", () => {
  console.log("database");
});
mongoose.connection.on("error", (err) => {
  console.log("database error", err);
});

app.listen(PORT, () => {
  console.log("server is running");
});

// app.use() this is how to use middle ware to make all the routes use it

// ot be specfic app.get("/", middleware,(req, res) => {
//   res.send("yo");
// });
