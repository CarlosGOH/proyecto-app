// frontend/src/components/AccessibleInput.jsx
import React, { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';

const AccessibleInput = ({ 
    label, 
    type = 'text', 
    value, 
    onChange, 
    placeholder,
    icon,
    required = false,
    ariaLabel,
    speechOnFocus = true,
    className = '',
    ...props 
}) => {
    const { speak } = useSpeech();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e) => {
        setIsFocused(true);
        if (speechOnFocus) {
            speak(label || ariaLabel || placeholder);
        }
        props.onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        props.onBlur?.(e);
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-lg font-bold text-gray-700 mb-2">
                    {icon && <span className="mr-2" role="img" aria-hidden="true">{icon}</span>}
                    {label}
                    {required && <span className="text-red-600 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                required={required}
                aria-label={ariaLabel || label}
                aria-required={required}
                className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-2 placeholder-gray-500 bg-white text-gray-900 transition-all ${
                    isFocused 
                        ? 'border-[#1B4D3E] ring-[#1B4D3E]' 
                        : 'border-gray-300'
                } ${className}`}
                {...props}
            />
        </div>
    );
};

export default AccessibleInput;