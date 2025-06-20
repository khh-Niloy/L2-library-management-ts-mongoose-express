import { model, Schema } from "mongoose";

const bookSchema = new Schema({});

export const Book = model("Book", bookSchema);
