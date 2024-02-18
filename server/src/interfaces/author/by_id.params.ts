import mongoose from "mongoose";

export default interface IByIdAuthorParams {
    authorId?: mongoose.Types.ObjectId;
}
