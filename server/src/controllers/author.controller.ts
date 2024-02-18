import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import Author from '../models/author';
import Book from '../models/book';
import mongoose from 'mongoose';
import IRequestAuthorBody from '../interfaces/author/request.body';
import IByIdAuthorParams from '../interfaces/author/by_id.params';
import { validateAuthor } from '../utils/request.validation';

export const getById: RequestHandler<
	IByIdAuthorParams,
	unknown,
	unknown,
	unknown
> = async (req, res, next) => {
	const authorId = req.params.authorId;

	try {
		if (!authorId) throw createHttpError(400, 'Missing parameters!');

		if (!mongoose.isValidObjectId(authorId))
			throw createHttpError(400, 'Invalid author id!');

		const author = await Author.findById(authorId).exec();

		if (!author) throw createHttpError(404, 'Author not found!');

		res.status(200).json(author);
	} catch (error) {
		next(error);
	}
};

export const getAll: RequestHandler<
	unknown,
	unknown,
	unknown,
	unknown
> = async (req, res, next) => {
	try {
		const authors = await Author.find().exec();

		if (!authors) throw createHttpError(404, 'No authors found!');

		res.status(200).json(authors);
	} catch (error) {
		next(error);
	}
};

export const create: RequestHandler<
	unknown,
	unknown,
	IRequestAuthorBody,
	unknown
> = async (req, res, next) => {
	const name = req.body.name;
	const surname = req.body.surname;

	try {
		if (!name || !surname)
			throw createHttpError(400, 'Missing parameters!');

		if (!validateAuthor.name(name) || !validateAuthor.surname(surname))
			throw createHttpError(400, 'Invalid parameters!');

		const author = await Author.create({
			name: name,
			surname: surname,
		});

		res.status(201).json(author);
	} catch (error) {
		next(error);
	}
};

export const update: RequestHandler<
	IByIdAuthorParams,
	unknown,
	IRequestAuthorBody,
	unknown
> = async (req, res, next) => {
	const authorId = req.params.authorId;
	const name = req.body.name || '';
	const surname = req.body.surname || '';

	try {
		let isAuthorEdited = false;

		if (!authorId) throw createHttpError(400, 'Missing parameters!');

		if (!mongoose.isValidObjectId(authorId))
			throw createHttpError(400, 'Invalid author id!');

		const author = await Author.findById(authorId).exec();

		if (!author) throw createHttpError(404, 'Author not found!');

		if (validateAuthor.name(name)) {
			author.name = name;
			isAuthorEdited = true;
		}

		if (validateAuthor.surname(surname)) {
			author.surname = surname;
			isAuthorEdited = true;
		}

		const updatedAuthor = isAuthorEdited ? await author.save() : {};

		res.status(200).json(updatedAuthor);
	} catch (error) {
		next(error);
	}
};

export const destroyById: RequestHandler<
	IByIdAuthorParams,
	unknown,
	unknown,
	unknown
> = async (req, res, next) => {
	const authorId = req.params.authorId;

	try {
		if (!authorId) throw createHttpError(400, 'Missing parameters!');

		if (!mongoose.isValidObjectId(authorId))
			throw createHttpError(400, 'Invalid author id!');

		const author = await Author.findById(authorId).exec();

		if (!author) throw createHttpError(404, 'Author not found!');

		const books = await Book.find({ authorId: author._id }).exec();

		if (books) {
			books.forEach(async (book) => {
				await book.deleteOne();
			});
		}

		await author.deleteOne();

		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
};
