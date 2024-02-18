import { InferSchemaType, Schema, model } from 'mongoose';

const bookSchema = new Schema(
	{
		authorId: { type: Schema.Types.ObjectId, required: true },
		isbn: { type: String, required: true },
		title: { type: String, required: true },
		description: { type: String, required: true },
		pages: { type: Number, required: true },
	},
	{ timestamps: true }
);

type Book = InferSchemaType<typeof bookSchema>;

export default model<Book>('Book', bookSchema);
