import { Link } from 'react-router-dom';
import AppLayout from './layouts/app.layout';

const NotFoundPage = () => {
	return (
		<AppLayout>
			<div className='container flex flex-col justify-center items-center mx-auto px-4 py-24'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='currentColor'
					className='text-slate-200 w-16 h-16 mb-8'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
					/>
				</svg>

				<p className='text-center text-xl font-semibold text-slate-600'>
					404 Page Not Found!
				</p>
				<Link
					to='/dashboard'
					className='text-slate-500 hover:text-sky-500 transition duration-150 mt-4'
				>
					Go to dashboard
				</Link>
			</div>
		</AppLayout>
	);
};

export default NotFoundPage;
