import logo from '../logo.svg';

const PageLoader = () => {
    return (
        <div className='fixed left-0 top-0 w-full h-full flex justify-center items-center bg-slate-300/80 backdrop-blur z-10'>
            <img
                src={logo}
                alt={process.env.REACT_APP_NAME}
                className='animate-spin h-24'
            />
        </div>
    );
};

export default PageLoader;
