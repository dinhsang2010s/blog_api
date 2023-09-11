import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { errorHandler } from "./middlewares/error";
dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//Error Middleware
//app.use(errorHandler);

// Connect to DB and start server
const PORT = process.env.PORT || 3000;
mongoose.connect(`${process.env.MONGODB_URL}`).then(() => {
  console.log("Connected to mongodb!");
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

//authentication
app.use("/api/auth", require("./routes/auth"));
