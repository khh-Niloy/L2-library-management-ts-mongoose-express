import express, { Request, Response } from "express";
import { bookRouter } from "./app/controllers/book.controller";
import { borrowRouter } from "./app/controllers/borrow.controller";
export const app = express();
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://a4-redux-ts-express-mongoose.vercel.app"],
    credentials: true, // optional, only if you're sending cookies
  })
);

app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management api");
});
