require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => {
    console.log("DB is connected");
  })
  .catch((error) => {
    console.log(error);
  });
