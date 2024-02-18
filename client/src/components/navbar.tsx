import { Link } from 'react-router-dom';
import logo from '../logo.svg';
import { useState } from 'react';

const Navbar = () => {	
	const [menuVisibility, setMenuVisibility] = useState(false);

	const handleMenuOpen = () => {
		setMenuVisibility(true);
		document.body.classList.add('overflow-hidden');
	};

	const handleMenuClose = () => {
		setMenuVisibility(false);
		document.body.classList.remove('overflow-hidden');
	};

	return (
		<nav className='bg-slate-900 text-slate-300 py-4'>
			<div className='container flex justify-between items-center mx-auto px-4'>
				<div className='flex justify-start items-center'>
					<div className='flex justify-center items-center'>
						<img
							src={logo}
							alt={process.env.REACT_APP_NAME}
							className='h-8'
						/>
						<span className='text-lg font-bold ms-2 select-none'>
							{process.env.REACT_APP_NAME}
						</span>
					</div>
					<ul className='hidden md:flex justify-center items-center ms-8'>
						<li className='me-4'>
							<Link
								to='/dashboard'
								className='hover:text-sky-400 transition duration-100 px-1 py-2'
							>
								Dashboard
							</Link>
						</li>
						<li className='me-4'>
							<Link
								to='/books'
								className='hover:text-sky-400 transition duration-100 px-1 py-2'
							>
								Books
							</Link>
						</li>
						<li className=''>
							<Link
								to='/authors'
								className='hover:text-sky-400 transition duration-100 px-1 py-2'
							>
								Authors
							</Link>
						</li>
					</ul>
				</div>
				<Link
					to='/logout'
					className='hidden md:block text-red-600 hover:text-red-400 bg-white/5 hover:bg-white/10 text-semibold text-sm rounded-full transition duration-150 px-4 py-2'
				>
					Logout
				</Link>
				<button
					className='flex md:hidden justify-center items-center text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 transition duration-150 rounded-full px-4 py-2'
					onClick={handleMenuOpen}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='w-5 h-5'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
						/>
					</svg>
					<span className='text-sm font-semibold ms-2'>Menu</span>
				</button>
			</div>
			{menuVisibility && (
				<div className='fixed left-0 top-0 w-screen h-screen flex flex-col justify-between bg-slate-600/80 backdrop-blur py-4 z-20'>
					<div className='container flex justify-between items-center mx-auto px-4'>
						<span className='text-xl font-bold'>Menu</span>
						<button className='hover:text-white transition duration-150' onClick={handleMenuClose}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='w-8 h-8'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M6 18 18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>
					<div className='container flex flex-col justify-center items-center flex-grow mx-auto px-4 py-16'>
						<Link
							to='/dashboard'
							onClick={handleMenuClose}
							className='text-lg font-semibold hover:text-white transition duration-150 mb-4'
						>
							Dashboard
						</Link>
						<Link
							to='/books'
							onClick={handleMenuClose}
							className='text-lg font-semibold hover:text-white transition duration-150 mb-4'
						>
							Books
						</Link>
						<Link
							to='/authors'
							onClick={handleMenuClose}
							className='text-lg font-semibold hover:text-white transition duration-150'
						>
							Authors
						</Link>
					</div>
					<div className='container flex justify-center items-center mx-auto px-4'>
						<Link
							to='/logout'
							onClick={handleMenuClose}
							className='font-semibold text-red-400 hover:text-red-200 transition duration-150'
						>
							Logout
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
