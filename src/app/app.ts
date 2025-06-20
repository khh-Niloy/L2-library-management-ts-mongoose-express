import express, { Request, Response } from "express";
import { bookRouter } from "./controllers/book.controller";
export const app = express();

app.use(express.json());

app.use("/books", bookRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Library Management API");
});
