// frontend/src/components/AccessibleButton.jsx
import React from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useVibration } from '../hooks/useVibration';

const AccessibleButton = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    ariaLabel,
    speechText,
    icon,
    disabled = false,
    className = '',
    ...props 
}) => {
    const { speak } = useSpeech();
    const { vibrateNotification } = useVibration();

    const handleClick = (e) => {
        if (disabled) return;
        
        vibrateNotification();
        if (speechText) {
            speak(speechText);
        }
        onClick?.(e);
    };

    const baseClasses = 'w-full py-4 px-6 text-xl font-bold rounded-2xl shadow-lg transform transition active:scale-95 focus:outline-none focus:ring-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
        primary: 'bg-[#1B4D3E] text-white focus:ring-[#2E8B57] hover:bg-[#2E8B57]',
        secondary: 'bg-white border-2 border-[#1B4D3E] text-[#1B4D3E] focus:ring-gray-300 hover:bg-gray-50',
        danger: 'bg-red-600 text-white focus:ring-red-400 hover:bg-red-700',
        success: 'bg-green-600 text-white focus:ring-green-400 hover:bg-green-700'
    };

    return (
        <button
            onClick={handleClick}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
            disabled={disabled}
            {...props}
        >
            {icon && <span className="text-2xl" role="img" aria-hidden="true">{icon}</span>}
            {children}
        </button>
    );
};

export default AccessibleButton;