import express, { Request, Response } from "express";
import { z } from "zod";
import { Book } from "../models/books.models";

export const bookRouter = express.Router();

const createBookZodSchema = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  isbn: z.string(),
  description: z.string(),
  copies: z.number(),
  available: z.boolean(),
});

bookRouter.post("/create-book", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const validateFromZod = await createBookZodSchema.parseAsync(body);
    const insertedBook = await Book.create(validateFromZod);
    res.json({
      success: true,
      message: "Book created successfully",
      data: insertedBook,
    });
  } catch (error) {
    res.send(error);
  }
});
