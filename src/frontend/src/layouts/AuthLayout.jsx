// frontend/src/layouts/AuthLayout.jsx
import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col justify-center px-6 py-12 bg-[#F5F5F5]">
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
                <div className="text-center">
                    <h1 className="text-5xl font-extrabold text-[#1B4D3E] mb-2">
                        EyesRoute
                    </h1>
                    <p className="text-xl text-gray-600">
                        Tu camino, seguro y accesible
                    </p>
                </div>
            </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;