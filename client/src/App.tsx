import { Route, Routes } from 'react-router-dom';
import NotFoundPage from './pages/not_found.page';
import LoginPage from './pages/auth/login.page';
import LogoutPage from './pages/auth/logout.page';
import DashboardPage from './pages/dashboard.page';
import BooksPage from './pages/books/page';
import AuthorsPage from './pages/authors/page';
import UserContext from './components/user_context';

const App = () => {
	return (
		<div className='App'>
			<UserContext>
				<Routes>
					<Route path='/' element={<LoginPage />} />
					<Route path='/dashboard' element={<DashboardPage />} />
					<Route path='/books' element={<BooksPage />} />
					<Route path='/books/:authorSlug' element={<BooksPage />} />
					<Route path='/authors' element={<AuthorsPage />} />
					<Route path='/logout' element={<LogoutPage />} />
					<Route path='*' element={<NotFoundPage />} />
				</Routes>
			</UserContext>
		</div>
	);
};

export default App;
