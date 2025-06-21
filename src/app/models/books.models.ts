import { model, Schema } from "mongoose";
import { IAvailability, IBook } from "../interfaces/books.interface";

const categoryList = [
  "FICTION",
  "NON_FICTION",
  "SCIENCE",
  "HISTORY",
  "BIOGRAPHY",
  "FANTASY",
];

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: [true, "Book's title is required"] },
    author: { type: String, required: [true, "Book's author is required"] },
    genre: {
      type: String,
      enum: {
        values: categoryList,
        message: `{VALUE} is not valid, Available categories: ${categoryList.join(
          ", "
        )}`,
      },
      required: [true, "genre is required"],
    },
    isbn: { type: String, unique: true, required: [true, "isbn is required"] },
    description: { type: String },
    copies: {
      type: Number,
      required: [true, "number of copies is required"],
      min: [0, "Total copies must be positive"],
    },
    available: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bookSchema.static(
  "updateAvailability",
  async function updateAvailability(bookInfo) {
    if (bookInfo.copies === 0) {
      await this.findByIdAndUpdate(bookInfo._id, {
        available: false,
      });
    }
  }
);

export const Book = model<IBook, IAvailability>("Book", bookSchema);
