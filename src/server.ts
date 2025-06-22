import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import mongoose from "mongoose";

const port = 8000;

async function server() {
  await mongoose.connect(`${process.env.MONGO_URI}`);
  console.log("mongoose connected");
  app.listen(port, () => {
    console.log("server is running at", port);
  });
}
server();
