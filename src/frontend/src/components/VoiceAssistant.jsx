// frontend/src/components/VoiceAssistant.jsx
import React, { useState, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { useVibration } from '../hooks/useVibration';

const VoiceAssistant = ({ commands = {}, autoGreet = false }) => {
    const { speak, speaking } = useSpeech();
    const { vibrateNotification } = useVibration();
    const [isActive, setIsActive] = useState(false);

    const voiceCommands = {
        'inicio': () => commands.goHome?.(),
        'viajes': () => commands.goTrips?.(),
        'perfil': () => commands.goProfile?.(),
        'solicitar viaje': () => commands.requestTrip?.(),
        'ayuda': () => speak('Puedes decir: inicio, viajes, perfil, solicitar viaje, o ayuda'),
        ...commands
    };

    const { startListening, stopListening, listening, transcript } = useVoiceCommands(voiceCommands);

    useEffect(() => {
        if (autoGreet) {
            setTimeout(() => {
                speak('Bienvenido a Eyes Route. Tu camino seguro y accesible.');
            }, 500);
        }
    }, [autoGreet]);

    const toggleListening = () => {
        if (listening) {
            stopListening();
            setIsActive(false);
        } else {
            vibrateNotification();
            speak('Escuchando');
            startListening();
            setIsActive(true);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-40">
            <button
                onClick={toggleListening}
                className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all duration-300 ${
                    listening 
                        ? 'bg-red-500 animate-pulse scale-110' 
                        : 'bg-[#1B4D3E] hover:scale-105'
                }`}
                aria-label={listening ? 'Detener asistente de voz' : 'Activar asistente de voz'}
                aria-pressed={listening}
            >
                {listening ? '🔴' : '🎤'}
            </button>
            
            {transcript && (
                <div className="absolute bottom-20 right-0 bg-white p-3 rounded-lg shadow-lg max-w-xs">
                    <p className="text-sm text-gray-700">
                        <strong>Escuché:</strong> {transcript}
                    </p>
                </div>
            )}

            {speaking && (
                <div className="absolute bottom-20 right-0 bg-[#1B4D3E] text-white p-3 rounded-lg shadow-lg">
                    <p className="text-sm">🔊 Hablando...</p>
                </div>
            )}
        </div>
    );
};

export default VoiceAssistant;