const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require("./config/keys");

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection.on("connected", () => {
  console.log("connect to mongo ");
});
mongoose.connection.on("error", () => {
  console.log("opps mongo error ");
});

require("./models/user");
require("./models/post");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  console.log("in preduction");
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    console.log("in preduction");
  });
}
app.listen(PORT, () => {
  console.log("Listing on 5000");
});

// const customMiddleware=(req,res,next)=>{
//     console.log("middleware")
//     next()
// }//which takes the incoming req and modifies it before it reaches to route handler
// // app.use(customMiddleware);//for all the routes
// app.get('/',(req,res)=>{
//     console.log('home')
//   res.send("heloo world")
// })
// app.get('/about',customMiddleware,(req,res)=>{
//     console.log('about')
//   res.send("habout page")
// })
