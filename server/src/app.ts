import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import createHttpError, { isHttpError } from 'http-errors';
import session from 'express-session';
import env from './utils/env.validation';
import MongoStore from 'connect-mongo';
import userRouter from './routes/user.routes';
import authorRouter from './routes/author.routes';
import bookRouter from './routes/book.routes';
import { requireAuth } from './middleware/auth';

const app = express();

app.use(morgan('dev')); // log requests to console
app.use(express.json()); // enable app to accept JSON bodies

// session
app.use(
	session({
		secret: env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 60 * 60 * 1000,
		},
		rolling: true,
		store: MongoStore.create({
			mongoUrl: env.MONGO_CONNECTION,
		}),
	})
);

// routing
app.use('/api/user', userRouter);
app.use('/api/author', requireAuth, authorRouter);
app.use('/api/book', requireAuth, bookRouter);

app.use((req, res, next) => next(createHttpError(404, 'Endpoint not found!'))); // non-existent route middleware (404)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
	let errorStatus = 500;
	let errorMessage = 'Unknown error occured!';

	if (isHttpError(error)) {
		errorStatus = error.status;
		errorMessage = error.message;
	}

	res.status(errorStatus).json({ message: errorMessage });
});

export default app;
