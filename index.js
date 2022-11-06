const express = require("express");
const connectDB = require("./api/config/connectDB");
const http = require("http");
const cors = require("cors");

require("dotenv").config();
const app = express();

connectDB();

const router = require("./api/routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/api", router);

app.use(function (err, req, res, next) {
  res.status(err.status || 404).send("route doesn't exist");
});

const PORT = process.env.PORT || 8002;
const server = http.createServer(app);
server.listen(PORT, function () {
  console.log(`Server is up on ${PORT}`);
});
