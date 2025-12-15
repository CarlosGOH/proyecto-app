// frontend/src/pages/passenger/RequestTrip.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import AccessibleInput from '../../components/AccessibleInput';
import AccessibleButton from '../../components/AccessibleButton';
import api from '../../services/api';
import { useSpeech } from '../../hooks/useSpeech';
import { useVibration } from '../../hooks/useVibration';

const RequestTrip = () => {
    const navigate = useNavigate();
    const { speak } = useSpeech();
    const { vibrateSuccess, vibrateError } = useVibration();
    const [loading, setLoading] = useState(false);
    const [tripData, setTripData] = useState({
        origin: '',
        destination: '',
        details: 'Asistencia requerida'
    });

    useEffect(() => {
        speak('Formulario de solicitud de viaje. Por favor ingresa tu origen y destino.');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!tripData.origin.trim() || !tripData.destination.trim()) {
            speak('Por favor completa todos los campos requeridos');
            vibrateError();
            return;
        }

        setLoading(true);
        speak('Solicitando viaje...');

        try {
            const response = await api.post('/api/trips/request', tripData);
            vibrateSuccess();
            speak('Viaje solicitado exitosamente. Buscando conductor cercano.');
            navigate(`/trip-status/${response.data.id}`);
        } catch (error) {
            vibrateError();
            const errorMsg = error.response?.data?.error || 'Error al solicitar viaje';
            speak(`Error: ${errorMsg}`);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUseCurrentLocation = () => {
        speak('Obteniendo ubicación actual');
        vibrateSuccess();
        // Simulación de geolocalización
        setTripData({ ...tripData, origin: 'Mi ubicación actual' });
        speak('Ubicación actual establecida');
    };

    return (
        <MainLayout pageTitle="Solicitar Viaje" showNav={true} showVoice={true}>
            <div className="min-h-screen">
                <header className="bg-[#1B4D3E] text-white p-6 shadow-lg">
                    <h1 className="text-3xl font-bold">Solicitar Viaje</h1>
                    <p className="text-green-200 mt-1">¿A dónde quieres ir?</p>
                </header>

                <main className="p-6">
                    <div className="max-w-2xl mx-auto">
                        {/* Quick Location Button */}
                        <div className="mb-6">
                            <AccessibleButton
                                variant="secondary"
                                icon="📍"
                                onClick={handleUseCurrentLocation}
                                speechText="Usar mi ubicación actual"
                            >
                                USAR MI UBICACIÓN ACTUAL
                            </AccessibleButton>
                        </div>

                        {/* Trip Request Form */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <AccessibleInput
                                    label="Origen"
                                    icon="📍"
                                    type="text"
                                    value={tripData.origin}
                                    onChange={(e) => setTripData({ ...tripData, origin: e.target.value })}
                                    placeholder="¿Desde dónde sales?"
                                    required
                                    ariaLabel="Ingresa tu ubicación de origen"
                                />

                                <AccessibleInput
                                    label="Destino"
                                    icon="🏁"
                                    type="text"
                                    value={tripData.destination}
                                    onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
                                    placeholder="¿A dónde vas?"
                                    required
                                    ariaLabel="Ingresa tu destino"
                                />

                                <AccessibleInput
                                    label="Detalles adicionales (opcional)"
                                    icon="📝"
                                    type="text"
                                    value={tripData.details}
                                    onChange={(e) => setTripData({ ...tripData, details: e.target.value })}
                                    placeholder="Información adicional para el conductor"
                                    ariaLabel="Detalles adicionales del viaje"
                                />

                                <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-300">
                                    <p className="text-sm text-gray-700 flex items-center gap-2">
                                        <span className="text-2xl">💡</span>
                                        <span>
                                            <strong>Consejo:</strong> Proporciona detalles específicos como 
                                            referencias cercanas para facilitar la ubicación.
                                        </span>
                                    </p>
                                </div>

                                <AccessibleButton
                                    type="submit"
                                    variant="primary"
                                    icon="🚖"
                                    disabled={loading}
                                    speechText="Solicitar viaje ahora"
                                >
                                    {loading ? 'SOLICITANDO...' : 'SOLICITAR VIAJE'}
                                </AccessibleButton>
                            </form>
                        </div>

                        {/* Safety Info */}
                        <div className="mt-6 bg-green-50 p-4 rounded-xl border-2 border-green-300">
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                <span className="text-2xl">🛡️</span>
                                <span>
                                    <strong>Viaje Seguro:</strong> Todos nuestros conductores están verificados
                                    y capacitados para brindar asistencia especializada.
                                </span>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </MainLayout>
    );
};

export default RequestTrip;