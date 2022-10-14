require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const tokenVerif = require("./middleware/tokenVerif");
const userRouter = require("./routes/userRouter");

const port = process.env.PORT;

const app = express();

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING)
  .then(() => console.log("Connected to mongo db successfully"))
  .catch(() => console.log("unable to connect to mongodb"));

app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  })
);

app.use(cookieParser());

app.use(bodyParser.json());

app.use(tokenVerif);

app.use(userRouter);

app.listen(port, () => console.log("server is listening"));
