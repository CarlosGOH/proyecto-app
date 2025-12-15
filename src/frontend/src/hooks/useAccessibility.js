// frontend/src/hooks/useAccessibility.js
import { useState, useEffect } from 'react';

const DEFAULT_PREFERENCES = {
    fontSize: 'medium',
    contrast: 'normal',
    brightness: 'normal',
    voiceGender: 'female'
};

export const useAccessibility = () => {
    const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

    useEffect(() => {
        // Cargar preferencias del localStorage
        const saved = localStorage.getItem('accessibility_preferences');
        if (saved) {
            try {
                setPreferences(JSON.parse(saved));
            } catch (error) {
                console.error('Error al cargar preferencias:', error);
            }
        }
    }, []);

    useEffect(() => {
        // Aplicar preferencias al DOM
        applyPreferences(preferences);
        // Guardar en localStorage
        localStorage.setItem('accessibility_preferences', JSON.stringify(preferences));
    }, [preferences]);

    const applyPreferences = (prefs) => {
        const root = document.documentElement;

        // Tamaño de fuente
        const fontSizes = {
            small: '14px',
            medium: '16px',
            large: '20px'
        };
        root.style.fontSize = fontSizes[prefs.fontSize] || fontSizes.medium;

        // Contraste
        const contrastClasses = {
            normal: '',
            high: 'high-contrast',
            highest: 'highest-contrast'
        };
        root.className = contrastClasses[prefs.contrast] || '';

        // Brillo
        const brightnessLevels = {
            low: '0.7',
            normal: '1',
            high: '1.2',
            highest: '1.4'
        };
        root.style.filter = `brightness(${brightnessLevels[prefs.brightness] || '1'})`;
    };

    const updatePreference = (key, value) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const resetPreferences = () => {
        setPreferences(DEFAULT_PREFERENCES);
    };

    return {
        preferences,
        updatePreference,
        resetPreferences
    };
};