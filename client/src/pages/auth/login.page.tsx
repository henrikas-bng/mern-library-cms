import { FormEvent, useEffect, useState } from 'react';
import Alert from '../../components/alert';
import logo from '../../logo.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserContext, useUserSetterContext } from '../../components/user_context';

const LoginPage = () => {
    const navigate = useNavigate();
    const user = useUserContext();
    const setUser = useUserSetterContext();

    // navigating user to /dashboard if already logged in
    useEffect(() => {
		if (user)
			navigate('/dashboard');
	}, [navigate, user]);

    // handling alert
	const [alertVisibility, setAlertVisibility] = useState(false);
	const handleAlertShow = () => setAlertVisibility(true);
	const handleAlertHide = () => setAlertVisibility(false);

	const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const inputEmail = e.currentTarget.children[0] as HTMLInputElement;
		const inputPassword = e.currentTarget.children[1] as HTMLInputElement;

		const email = inputEmail.value;
		const password = inputPassword.value;

        // front-end input validation (back-end has it too)
        const regexEmail = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
        const regexPassword = new RegExp('^[a-zA-Z0-9!@#$%&*?]{8,32}$');
		
		const isInputValid = (regexEmail.test(email) && regexPassword.test(password));        

		if (isInputValid) {
			await axios
				.post('/api/user/login', {
					email: email,
					password: password,
				})
				.then((r) => {
					const data = r.data;
	
					// if credentials checks out - login and navigate to /dashboard
					if (data && setUser) {
						setUser(data);
						navigate('/dashboard');
					}
				})
				.catch((_) => {
					handleAlertShow();
				});
		} else {
			handleAlertShow();
		}
		
		inputEmail.value = '';
		inputPassword.value = '';		
	};

	return (
		<div className='container flex flex-col justify-center items-center min-h-screen text-slate-600 mx-auto px-4 py-8'>
			<div className='flex flex-col justify-center items-center'>
				<img
					src={logo}
					alt={process.env.REACT_APP_NAME}
					className='h-24 mb-4'
				/>
				<span className='text-center text-xl font-semibold'>
					{process.env.REACT_APP_NAME}
				</span>
			</div>
			<div className='my-24'>
				<Alert
					variant='danger'
					show={alertVisibility}
					hideHandler={handleAlertHide}
				>
					Invalid credentials!
				</Alert>
				<form
					id='login_submit'
					className='flex flex-col justify-center items-center'
					onSubmit={handleFormSubmit}
				>
					<input
						type='email'
						name='login_email'
						placeholder='Email address'
						className='ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2 mb-4'
						required
					/>
					<input
						type='password'
						name='login_password'
						placeholder='Password'
						className='ring-0 outline-0 focus:outline-4 outline-sky-500/25 border border-slate-600/25 rounded transition duration-150 px-4 py-2 mb-8'
						minLength={8}
						maxLength={32}
						required
					/>
					<button
						type='submit'
						form='login_submit'
						className='bg-slate-600 hover:bg-slate-500 transition duration-150 text-white rounded px-8 py-2'
					>
						Login
					</button>
				</form>
			</div>
			<p className='text-sm'>github.com/henrikas-bng</p>
		</div>
	);
};

export default LoginPage;
