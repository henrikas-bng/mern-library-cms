import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import Book from '../models/book';
import Author from '../models/author';
import mongoose from 'mongoose';
import IRequestBookBody from '../interfaces/book/request.body';
import IByIdBookParams from '../interfaces/book/by_id.params';
import IByIdAuthorParams from '../interfaces/author/by_id.params';
import { validateBook } from '../utils/request.validation';

export const getById: RequestHandler<
	IByIdBookParams,
	unknown,
	unknown,
	unknown
> = async (req, res, next) => {
	const bookId = req.params.bookId;

	try {
		if (!bookId) throw createHttpError(400, 'Missing parameters!');

		if (!mongoose.isValidObjectId(bookId))
			throw createHttpError(400, 'Invalid parameters!');

		const book = await Book.findById(bookId).exec();

		if (!book) throw createHttpError(404, 'Book not found!');

		res.status(200).json(book);
	} catch (error) {
		next(error);
	}
};

export const getAll: RequestHandler = async (req, res, next) => {
	try {
		const books = await Book.find().exec();

		if (!books) throw createHttpError(404, 'No books found!');

		res.status(200).json(books);
	} catch (error) {
		next(error);
	}
};

export const getAllByAuthorId: RequestHandler<
	IByIdAuthorParams,
	unknown,
	unknown,
	unknown
> = async (req, res, next) => {
	const authorId = req.params.authorId;

	try {
		if (!authorId) throw createHttpError(400, 'Missing parameters!');

		if (!mongoose.isValidObjectId(authorId))
			throw createHttpError(400, 'Invalid parameters!');

		const author = await Author.findById(authorId).exec();

		if (!author) throw createHttpError(404, 'Author not found!');

		const books = await Book.find({ authorId: authorId }).exec();

		if (!books) throw createHttpError(404, 'No books found!');

		res.status(200).json(books);
	} catch (error) {
		next(error);
	}
};

export const create: RequestHandler<
	unknown,
	unknown,
	IRequestBookBody,
	unknown
> = async (req, res, next) => {
	const authorId = req.body.authorId;
	const isbn = req.body.isbn;
	const title = req.body.title;
	const description = req.body.description;
	const pages = req.body.pages;

	try {
		if (!authorId || !isbn || !title || !description || !pages)
			throw createHttpError(400, 'Missing parameters!');

		if (
			!mongoose.isValidObjectId(authorId) ||
			!validateBook.isbn(isbn) ||
			!validateBook.title(title) ||
			!validateBook.description(description) ||
			!validateBook.pages(pages)
		)
			throw createHttpError(400, 'Invalid parameters!');

		const book = await Book.create({
			authorId: authorId,
			isbn: isbn,
			title: title,
			description: description,
			pages: pages,
		});

		res.status(201).json(book);
	} catch (error) {
		next(error);
	}
};

export const update: RequestHandler<
	IByIdBookParams,
	unknown,
	IRequestBookBody,
	unknown
> = async (req, res, next) => {
	const bookId = req.params.bookId;
	const authorId = req.body.authorId;
	const isbn = req.body.isbn || '';
	const title = req.body.title || '';
	const description = req.body.description || '';
	const pages = req.body.pages || 0;

	try {
		let isBookEdited = false;

		if (!bookId || !authorId)
			throw createHttpError(400, 'Missing parameters!');

		if (
			!mongoose.isValidObjectId(bookId) ||
			!mongoose.isValidObjectId(authorId)
		)
			throw createHttpError(400, 'Invalid parameters!');

		const book = await Book.findById(bookId).exec();

		if (!book) throw createHttpError(404, 'Book not found!');

		if (validateBook.isbn(isbn)) {
            book.isbn = isbn;
            isBookEdited = true;
        }

		if (validateBook.title(title)) {
            book.title = title;
            isBookEdited = true;
        }

		if (validateBook.description(description)) {
            book.description = description;
            isBookEdited = true;
        }			

		if (validateBook.pages(pages)) {
            book.pages = pages;
            isBookEdited = true;
        }

		const updatedBook = isBookEdited ? (await book.save()) : {};

		res.status(200).json(updatedBook);
	} catch (error) {
		next(error);
	}
};

export const destroyById: RequestHandler<
	IByIdBookParams,
	unknown,
	unknown,
	unknown
> = async (req, res, next) => {
	const bookId = req.params.bookId;

	try {
		if (!bookId)
            throw createHttpError(400, 'Missing parameters!');

        if (!mongoose.isValidObjectId(bookId))
            throw createHttpError(400, 'Invalid parameters!');

        await Book.findByIdAndDelete(bookId).exec();

        res.sendStatus(200);
	} catch (error) {
		next(error);
	}
};
