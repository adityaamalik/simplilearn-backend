const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    dbName: "simpliLearnDB",
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");

app.use(authJwt());
app.use(errorHandler);
//routes
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);

app.get("/", (req, res) => {
  res.send("API working fine !");
});

app.listen(process.env.PORT, () =>
  console.log(`Server is running on ${process.env.PORT}`)
);
