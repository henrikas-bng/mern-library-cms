import mongoose from "mongoose";

export default interface IByIdBookParams {
    bookId?: mongoose.Types.ObjectId;
}
