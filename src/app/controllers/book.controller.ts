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

    let query = {};
    if (filter) {
      query = { genre: filter };
    }
    const data = await Book.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .limit(limitInt);

    successResponseApi(res, 200, "Books retrieved successfully", data);
  } catch (error: any) {
    errorResponseApi(res, 404, "failed to retrieve book", error);
    // const { message, name, ...otherInfo } = error;
    // res.json({
    //   errorMessage: message,
    //   errorName: name,
    //   others: otherInfo,
    // });
  }
});

bookRouter.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;
    const singleBook = await Book.findById(id);

    if (!singleBook) {
      throw new Error("did not match the ID, not found");
    }
    successResponseApi(res, 200, "Book retrieved successfully", singleBook);
  } catch (error: any) {
    errorResponseApi(res, 404, "failed to get single book", error);
  }
});

bookRouter.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const validateFromZod = await createBookZodSchema.parseAsync(body);
    const insertedBook = await Book.create(validateFromZod);
    successResponseApi(res, 201, "Book created successfully", insertedBook);
  } catch (error: any) {
    errorResponseApi(res, 400, "failed to create book in db", error);
  }
});

bookRouter.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;
    const updatedInfo = req.body;

    const updateBookInfo = await Book.findByIdAndUpdate(id, updatedInfo, {
      new: true,
    });

    if (!updateBookInfo) {
      throw new Error("id did not match, not found");
    }

    successResponseApi(res, 200, "Book updated successfully", updateBookInfo);
  } catch (error) {
    errorResponseApi(res, 400, "failed to update book info", error);
  }
});

bookRouter.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const id = req.params.bookId;
    const deletedDoc = await Book.findByIdAndDelete(id);

    if (!deletedDoc) {
      throw new Error("id did not match, not found");
    }
    successResponseApi(res, 200, "Book deleted successfully", null);
  } catch (error) {
    errorResponseApi(res, 404, "failed to delete book", error);
  }
});
