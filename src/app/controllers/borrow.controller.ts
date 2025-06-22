import express, { Request, Response } from "express";
import { Book } from "../models/books.models";
import { Borrow } from "../models/borrow.models";
import { errorResponseApi, successResponseApi } from "../utils/apiResponse";
import { z } from "zod";
export const borrowRouter = express.Router();

const createBorrowZodSchema = z.object({
  book: z.string().min(1, "Book ID is required"),
  quantity: z.number().positive("Positive number please"),
  dueDate: z.string().min(1, "Due date is required"),
});

borrowRouter.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const validateFromZod = await createBorrowZodSchema.parseAsync(body);

    const { book, quantity, dueDate } = validateFromZod;

    const bookInfo = await Book.findById(book);

    if (!bookInfo) {
      throw new Error("Book not found");
    }
    if (quantity > bookInfo.copies) {
      throw new Error(`sorry, ${quantity} copies not available`);
    }

    const updatedData = await Book.findByIdAndUpdate(
      book,
      {
        $inc: { copies: -quantity },
      },
      { new: true }
    );
    await Book.updateAvailability(updatedData);

    const borrowBookCreatedInfo = await Borrow.create(body);

    successResponseApi(
      res,
      201,
      "Book borrowed successfully",
      borrowBookCreatedInfo
    );
  } catch (error) {
    errorResponseApi(res, 404, "failed to Book borrowed operation", error);
  }
});

borrowRouter.get("/", async (req: Request, res: Response) => {
  try {
    const mergedData = await Borrow.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      { $unwind: "$bookInfo" },
      {
        $group: {
          _id: "$book",
          title: { $first: "$bookInfo.title" },
          isbn: { $first: "$bookInfo.isbn" },
          total: { $sum: "$quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$title",
            isbn: "$isbn",
          },
          totalQuantity: "$total",
        },
      },
    ]);
    successResponseApi(
      res,
      200,
      "Borrowed books summary retrieved successfully",
      mergedData
    );
  } catch (error) {
    errorResponseApi(
      res,
      404,
      "failed to Borrowed books summary retrieved",
      error
    );
  }
});
