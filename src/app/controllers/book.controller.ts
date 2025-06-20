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

bookRouter.get("/books", async (req: Request, res: Response) => {
  const {
    filter,
    sortBy = "createdAt",
    sort = "asc",
    limit = "10",
  } = req.query;

  const sortOrder = sort === "asc" ? 1 : -1;
  const limitInt = parseInt(limit as string);

  let data;
  if (req.query) {
    data = await Book.aggregate([
      { $match: { genre: filter } },
      { $sort: { [sortBy as string]: sortOrder } },
      { $limit: limitInt },
    ]);
  }
  data = await Book.find({});

  res.json({
    query: { filter, sortBy, sort, limit },
    books: data,
  });
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
