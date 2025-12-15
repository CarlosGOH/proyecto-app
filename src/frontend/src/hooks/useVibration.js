// frontend/src/hooks/useVibration.js
import { useState, useEffect } from 'react';

export const useVibration = () => {
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        setSupported('vibrate' in navigator);
    }, []);

    const vibrate = (pattern = 200) => {
        if (supported) {
            navigator.vibrate(pattern);
        }
    };

    const vibrateSuccess = () => {
        vibrate([100, 50, 100]);
    };

    const vibrateError = () => {
        vibrate([200, 100, 200, 100, 200]);
    };

    const vibrateWarning = () => {
        vibrate([150, 75, 150]);
    };

    const vibrateNotification = () => {
        vibrate(100);
    };

    return {
        vibrate,
        vibrateSuccess,
        vibrateError,
        vibrateWarning,
        vibrateNotification,
        supported
    };
};