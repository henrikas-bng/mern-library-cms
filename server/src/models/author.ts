import { InferSchemaType, Schema, model } from 'mongoose';

const authorSchema = new Schema(
	{
		name: { type: String, required: true },
		surname: { type: String, required: true },
	},
	{ timestamps: true }
);

type Author = InferSchemaType<typeof authorSchema>;

export default model<Author>('Author', authorSchema);
