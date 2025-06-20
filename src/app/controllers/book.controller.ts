import express, { Request, Response } from "express";

export const bookRouter = express.Router();

bookRouter.get("/test", (req: Request, res: Response) => {
  res.send("testing");
});
