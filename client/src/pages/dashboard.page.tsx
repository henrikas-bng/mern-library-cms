import AppLayout from './layouts/app.layout';

const DashboardPage = () => {
	return (
		<AppLayout>
			<div className='container flex justify-center items-center mx-auto px-4'>
				<img src={require('../assets/img/dashboard.gif')} alt={process.env.REACT_APP_NAME} />
			</div>
		</AppLayout>
	);
};

export default DashboardPage;
