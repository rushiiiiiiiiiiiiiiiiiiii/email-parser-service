const express = require("express");
const emailRoutes = require("./routes/emailRoutes");
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(require("cors")());


app.use("/emails", emailRoutes);

app.get("/", (req, res) => {
  res.send("Email Parser Service is running");
});

module.exports = app;
