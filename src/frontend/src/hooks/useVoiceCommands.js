// frontend/src/hooks/useVoiceCommands.js
import { useEffect, useState, useRef } from 'react';

export const useVoiceCommands = (commands = {}) => {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [supported, setSupported] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            setSupported(true);
            const recognition = new SpeechRecognition();
            recognition.lang = 'es-ES';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setListening(true);
            recognition.onend = () => setListening(false);
            
            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript.toLowerCase();
                setTranscript(text);
                
                // Ejecutar comando si coincide
                Object.keys(commands).forEach(command => {
                    if (text.includes(command.toLowerCase())) {
                        commands[command]();
                    }
                });
            };

            recognition.onerror = (event) => {
                console.error('Error de reconocimiento de voz:', event.error);
                setListening(false);
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [commands]);

    const startListening = () => {
        if (supported && recognitionRef.current && !listening) {
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (supported && recognitionRef.current && listening) {
            recognitionRef.current.stop();
        }
    };

    return { 
        startListening, 
        stopListening, 
        listening, 
        transcript, 
        supported 
    };
};