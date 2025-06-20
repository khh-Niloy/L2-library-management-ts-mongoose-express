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
  try {
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
  } catch (error: any) {
    const { message, name, ...otherInfo } = error;
    res.json({
      errorMessage: message,
      errorName: name,
      others: otherInfo,
    });
  }
});

bookRouter.get("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;

    const singleBook = await Book.findById(id);

    res.json({
      success: true,
      message: "Book retrieved successfully",
      data: singleBook,
    });
  } catch (error: any) {
    const { message, name, ...otherInfo } = error;
    res.json({
      errorMessage: message,
      errorName: name,
      others: otherInfo,
    });
  }
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

bookRouter.put("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;
    const updatedInfo = req.body;

    const updateBookInfo = await Book.findByIdAndUpdate(id, updatedInfo, {
      new: true,
    });

    res.json({
      success: true,
      message: "Book updated successfully",
      data: updateBookInfo,
    });
  } catch (error) {
    res.send(error);
  }
});

bookRouter.delete("/books/:bookId", async (req: Request, res: Response) => {
  const id = req.params.bookId;
  await Book.findByIdAndDelete(id);

  res.json({
    success: true,
    message: "Book deleted successfully",
    data: null,
  });
});
