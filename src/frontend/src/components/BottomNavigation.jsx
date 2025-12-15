// frontend/src/components/BottomNavigation.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSpeech } from '../hooks/useSpeech';
import { useVibration } from '../hooks/useVibration';

const BottomNavigation = ({ role = 'passenger' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { speak } = useSpeech();
    const { vibrateNotification } = useVibration();

    const passengerTabs = [
        { id: 'home', label: 'Inicio', icon: '🏠', path: '/dashboard', ariaLabel: 'Ir a inicio' },
        { id: 'trips', label: 'Viajes', icon: '🚖', path: '/trips', ariaLabel: 'Ver mis viajes' },
        { id: 'assistant', label: 'Asistente', icon: '🎤', path: '/assistant', ariaLabel: 'Asistente de voz' },
        { id: 'profile', label: 'Perfil', icon: '👤', path: '/profile', ariaLabel: 'Ver mi perfil' }
    ];

    const driverTabs = [
        { id: 'home', label: 'Inicio', icon: '🏠', path: '/driver', ariaLabel: 'Ir a inicio' },
        { id: 'active', label: 'Activo', icon: '🚗', path: '/driver/active', ariaLabel: 'Viaje activo' },
        { id: 'earnings', label: 'Ganancias', icon: '💰', path: '/driver/earnings', ariaLabel: 'Ver ganancias' },
        { id: 'profile', label: 'Perfil', icon: '👤', path: '/driver/profile', ariaLabel: 'Ver mi perfil' }
    ];

    const tabs = role === 'conductor' ? driverTabs : passengerTabs;

    const handleTabClick = (tab) => {
        vibrateNotification();
        speak(tab.label);
        navigate(tab.path);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav 
            className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#1B4D3E] shadow-2xl z-50"
            role="navigation"
            aria-label="Navegación principal"
        >
            <div className="flex justify-around items-center h-20 max-w-screen-xl mx-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab)}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                            isActive(tab.path)
                                ? 'bg-[#1B4D3E] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-label={tab.ariaLabel}
                        aria-current={isActive(tab.path) ? 'page' : undefined}
                    >
                        <span className="text-3xl mb-1" role="img" aria-hidden="true">
                            {tab.icon}
                        </span>
                        <span className="text-xs font-bold">{tab.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNavigation;