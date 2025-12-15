// frontend/src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ message = 'Cargando...', size = 'medium' }) => {
    const sizeClasses = {
        small: 'w-8 h-8',
        medium: 'w-16 h-16',
        large: 'w-24 h-24'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8" role="status" aria-live="polite">
            <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-[#1B4D3E] rounded-full animate-spin`}></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">{message}</p>
        </div>
    );
};

export default LoadingSpinner;