import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import User from '../models/user';
import bcrypt from 'bcrypt';
import ILoginUserBody from '../interfaces/user/login.body';
import IRegisterUserBody from '../interfaces/user/register.body';
import { validateUser } from '../utils/request.validation';

export const getUserFromSession: RequestHandler = async (req, res, next) => {
	try {
		const user = await User.findById(req.session.userId).exec();
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

export const register: RequestHandler<
	unknown,
	unknown,
	IRegisterUserBody,
	unknown
> = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	try {
		if (!email || !password)
			throw createHttpError(400, 'Missing parameters');

		if (!validateUser.email(email) || !validateUser.password(password))
			throw createHttpError(400, 'Invalid parameters!');

		const existingEmail = await User.findOne({ email: email }).exec();

		if (existingEmail)
			throw createHttpError(
				409,
				'User with this email address already exists!'
			);

		const passwordHashed = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			email: email,
			password: passwordHashed,
		});

		req.session.userId = newUser._id;
		newUser.password = ''; // can't return password to frontend

		res.status(201).json(newUser);
	} catch (error) {
		next(error);
	}
};

export const login: RequestHandler<
	unknown,
	unknown,
	ILoginUserBody,
	unknown
> = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	try {
		if (!email || !password)
			throw createHttpError(400, 'Missing parameters');

		if (!validateUser.email(email) || !validateUser.password(password))
			throw createHttpError(400, 'Invalid parameters!');

		const user = await User.findOne({ email: email })
			.select('+password')
			.exec();

		if (!user) throw createHttpError(401, 'Invalid credentials!');

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect)
			throw createHttpError(401, 'Invalid credentials!');

		req.session.userId = user._id;
		user.password = ''; // can't return password to frontend

		res.status(201).json(user);
	} catch (error) {
		next(error);
	}
};

export const logout: RequestHandler = async (req, res, next) => {
	req.session.destroy((error) => {
		if (error) {
			next(error);
		} else {
			res.sendStatus(200);
		}
	});
};
