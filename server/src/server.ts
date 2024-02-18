import app from './app';
import env from './utils/env.validation';
import mongoose from 'mongoose';

mongoose
	.connect(env.MONGO_CONNECTION)
	.then(() => app.listen(env.PORT))
	.catch(console.error);
