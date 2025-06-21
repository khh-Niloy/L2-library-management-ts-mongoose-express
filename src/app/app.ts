import express, { Request, Response } from "express";
import { bookRouter } from "./controllers/book.controller";
import { borrowRouter } from "./controllers/borrow.controller";
export const app = express();

app.use(express.json());

app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Library Management API");
});
