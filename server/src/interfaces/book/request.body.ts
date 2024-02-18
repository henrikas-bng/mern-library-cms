import mongoose from "mongoose";

export default interface IRequestBookBody {
    authorId?: mongoose.Types.ObjectId;
    isbn?: string;
    title?: string;
    description?: string;
    pages?: number;
}
