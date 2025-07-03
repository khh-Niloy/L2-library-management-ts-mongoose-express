import express, { Request, Response } from "express";
import { bookRouter } from "./app/controllers/book.controller";
import { borrowRouter } from "./app/controllers/borrow.controller";
export const app = express();
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: ["*"],
    credentials: true,
  })
);

app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management api");
});
