// frontend/src/hooks/useSpeech.js
import { useEffect, useRef, useState } from 'react';

export const useSpeech = () => {
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);
    const utteranceRef = useRef(null);

    useEffect(() => {
        setSupported('speechSynthesis' in window);
    }, []);

    const speak = (text, options = {}) => {
        if (!supported) {
            console.warn('Text-to-Speech no soportado en este navegador');
            return;
        }

        // Cancelar cualquier speech en curso
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = options.lang || 'es-ES';
        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const stop = () => {
        if (supported) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        }
    };

    const pause = () => {
        if (supported && speaking) {
            window.speechSynthesis.pause();
        }
    };

    const resume = () => {
        if (supported) {
            window.speechSynthesis.resume();
        }
    };

    return { speak, stop, pause, resume, speaking, supported };
};