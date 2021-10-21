const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGO_URI } = require("./config/keys");
const PORT = process.env.PORT || 5000;
app.use(express.json());
require("./Schema/user");
require("./Schema/post");

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/users"));

mongoose.connect(MONGO_URI);
mongoose.connection.on("connected", () => {
  console.log("database");
});
mongoose.connection.on("error", (err) => {
  console.log("database error", err);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server is running");
});
