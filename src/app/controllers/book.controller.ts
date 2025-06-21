import express, { Request, Response } from "express";
import { z } from "zod";
import { Book } from "../models/books.models";
import { errorResponseApi, successResponseApi } from "../utils/apiResponse";

export const bookRouter = express.Router();

const createBookZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.enum([
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
  ]),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z
    .number({
      required_error: "number of copies is required",
      invalid_type_error: "Must be a number",
    })
    .nonnegative("Can not be negative"),
  available: z.boolean().default(true),
});

bookRouter.get("/", async (req: Request, res: Response) => {
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
      success: true,
      message: "Books retrieved successfully",
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

bookRouter.get("/:bookId", async (req: Request, res: Response) => {
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

bookRouter.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const validateFromZod = await createBookZodSchema.parseAsync(body);
    const insertedBook = await Book.create(validateFromZod);
    successResponseApi(res, "Book created successfully", insertedBook);
  } catch (error: any) {
    errorResponseApi(res, "failed to create book in db", error);
  }
});

bookRouter.put("/:bookId", async (req: Request, res: Response) => {
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

bookRouter.delete("/:bookId", async (req: Request, res: Response) => {
  const id = req.params.bookId;
  await Book.findByIdAndDelete(id);

  res.json({
    success: true,
    message: "Book deleted successfully",
    data: null,
  });
});
