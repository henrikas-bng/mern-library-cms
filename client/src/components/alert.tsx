import { ReactNode } from "react";

interface AlertProps {
    children: ReactNode;
    variant: string;
    show: boolean;
    hideHandler: () => void;
};

const Alert = ({ children, variant, show, hideHandler }: AlertProps) => {
    if (!show) return <></>;

    const setVariant = () => {
        let className = '';

        switch (variant) {
            case 'danger':
                className = 'bg-red-200';
                break;
            case 'success':
                className = 'bg-green-200';
                break;
            case 'info':
                className = 'bg-sky-200';
                break;
            case 'warning':
                className = 'bg-amber-200';
                break;
        }

        return className;
    };

    return (
        <div className={`flex justify-between items-center ${setVariant()} text-white rounded my-4 p-2`}>
            <p className='flex-grow text-sm font-semibold'>{children}</p>
            <button onClick={() => hideHandler()} className='ms-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default Alert;
