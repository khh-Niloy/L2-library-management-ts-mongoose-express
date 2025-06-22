import { HydratedDocument, model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./books.models";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      required: [true, "Borrowed Book id is required"],
    },
    quantity: { type: Number, required: [true, "quantity is required"] },
    dueDate: { type: Date, required: [true, "dueDate is required"] },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

borrowSchema.post("save", async function (doc) {
  if (doc) {
    const book = await Book.findById(doc.book);
    await Book.updateAvailability(book);
  }
});

export const Borrow = model("Borrow", borrowSchema);
