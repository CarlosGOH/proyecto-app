// frontend/src/layouts/MainLayout.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from '../components/BottomNavigation';
import VoiceAssistant from '../components/VoiceAssistant';
import { useNavigate } from 'react-router-dom';
import { useSpeech } from '../hooks/useSpeech';

const MainLayout = ({ children, showNav = true, showVoice = true, pageTitle }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { speak } = useSpeech();

    useEffect(() => {
        if (pageTitle) {
            document.title = `${pageTitle} - EyesRoute`;
            speak(pageTitle);
        }
    }, [pageTitle]);

    const voiceCommands = {
        goHome: () => navigate(user?.role === 'conductor' ? '/driver' : '/dashboard'),
        goTrips: () => navigate(user?.role === 'conductor' ? '/driver/history' : '/trips'),
        goProfile: () => navigate(user?.role === 'conductor' ? '/driver/profile' : '/profile'),
        requestTrip: () => navigate('/dashboard')
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {children}
            {showNav && <BottomNavigation role={user?.role} />}
            {showVoice && <VoiceAssistant commands={voiceCommands} />}
        </div>
    );
};

export default MainLayout;