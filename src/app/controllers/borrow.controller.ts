import express, { Request, Response } from "express";
import { Book } from "../models/books.models";
import { Borrow } from "../models/borrow.models";
export const borrowRouter = express.Router();

borrowRouter.post("/borrow", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { book, quantity, dueDate } = body;

    const bookInfo = await Book.findById(book);

    if (!bookInfo) {
      throw new Error("Book not found");
      //   return res.json({ message: "Book not found" });
    }

    if (quantity > bookInfo.copies) {
      throw new Error(`sorry, ${quantity} copies not available`);
      //   return res.json({ message: `sorry, ${quantity} copies not available` });
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

    res.json({
      success: true,
      message: "Book borrowed successfully",
      data: borrowBookCreatedInfo,
    });
  } catch (error) {
    res.send(error);
  }
});

borrowRouter.get("/borrow", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      message: "Book borrowed successfully",
      // data: updatedData,
    });
  } catch (error) {
    res.send(error);
  }
});
