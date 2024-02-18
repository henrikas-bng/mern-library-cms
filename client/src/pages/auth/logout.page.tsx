import { Navigate } from 'react-router-dom';
import { useUserSetterContext } from '../../components/user_context';
import { useEffect } from 'react';
import axios from 'axios';

const LogoutPage = () => {
	const setUser = useUserSetterContext();

	useEffect(() => {
		const logoutUser = async () => {
			if (setUser)
				await axios.post('/api/user/logout')
					.finally(() => setUser(null));
		};

		logoutUser();
	}, [setUser]);

	return <Navigate to={'/'} />;
};

export default LogoutPage;
