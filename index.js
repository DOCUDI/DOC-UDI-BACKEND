const express = require("express");
const connectDB = require("./api/config/connectDB");
const http = require("http");
const cors = require("cors");

require("dotenv").config();
const app = express();

connectDB();

const router = require("./api/routes");

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods: GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.urlencoded({ extended: true }));
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET,PUT,POST,DELETE,PATCH,OPTIONS");
// header(
//   "Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization"
// );

// app.use(cors(corsOptions));

app.use("/api", router);

app.use(function (err, req, res, next) {
  res.status(err.status || 404).send("route doesn't exist");
});

const PORT = process.env.PORT || 8002;
const server = http.createServer(app);
server.listen(PORT, function () {
  console.log(`Server is up on ${PORT}`);
});
