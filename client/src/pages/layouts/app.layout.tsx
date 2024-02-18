import Footer from '../../components/footer';
import Navbar from '../../components/navbar';

const AppLayout = ({ children }: any) => {

	return (
		<>
			<header>
				<Navbar />
			</header>
			<main className='pt-8 pb-16'>
                {children}
            </main>
			<Footer />
		</>
	);
};

export default AppLayout;
