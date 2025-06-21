import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";

const BorrowSchema = new Schema<IBorrow>(
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

export const Borrow = model("Borrow", BorrowSchema);
