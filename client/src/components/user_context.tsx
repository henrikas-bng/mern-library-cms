import axios from 'axios';
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import PageLoader from './page_loader';

interface IUserContextProps {
	children: ReactNode;
}

const UserDataContext = createContext<Object | null>(null);

const UserDataSetterContext = createContext<
	Dispatch<SetStateAction<Object | null>> | undefined
>(undefined);

const UserContext = ({ children }: IUserContextProps) => {
	const navigate = useNavigate();
	const [user, setUser] = useState<Object | null>(null);
	const [pageLoading, setPageLoading] = useState(false);

    // getting logged in user data (back-end session cookie)
	useEffect(() => {
        const getLoggedInUserData = async () => {
            setPageLoading(true);
            await axios
                .get('/api/user')
                .then((r) => {
                    const data = r.data;
    
                    if (data) setUser(data);
                })
                .catch((_) => {
					console.log('Login expired..');
                    navigate('/');
                })
                .finally(() => setPageLoading(false));
        };

		if (!user)
			getLoggedInUserData();
	}, [navigate, user]);

	return (
		<UserDataContext.Provider value={user}>
			<UserDataSetterContext.Provider value={setUser}>
				{pageLoading && 
					<PageLoader />}
				{children}
			</UserDataSetterContext.Provider>
		</UserDataContext.Provider>
	);
};

export const useUserContext = () => useContext(UserDataContext);
export const useUserSetterContext = () => useContext(UserDataSetterContext);

export default UserContext;
