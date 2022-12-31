const express = require("express");
const app = express();
// const cors = require("cors");
const morgan = require("morgan");
const users = require("./routes/usersRoutes");

require("dotenv").config;

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/users", users);
app.listen(5000, () => console.log("connected to " + PORT));
