// frontend/src/pages/passenger/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../../layouts/MainLayout';
import AccessibleButton from '../../components/AccessibleButton';
import AccessibleInput from '../../components/AccessibleInput';
import api from '../../services/api';
import { useSpeech } from '../../hooks/useSpeech';
import { useVibration } from '../../hooks/useVibration';

const Home = () => {
    const { user } = useAuth();
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
        speak(`Bienvenido ${user?.name}. ¿A dónde quieres ir hoy?`);
    }, []);

    const handleRequestTrip = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/api/trips/request', tripData);
            vibrateSuccess();
            speak('Viaje solicitado exitosamente. Buscando conductor cercano.');
            navigate(`/trip-status/${response.data.id}`);
        } catch (error) {
            vibrateError();
            speak('Error al solicitar viaje. Por favor intenta nuevamente.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout pageTitle="Inicio" showNav={true} showVoice={true}>
            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <header className="bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-[#1B4D3E]">
                        Hola, {user?.name} 👋
                    </h1>
                    <p className="text-gray-600 mt-1">¿A dónde vamos hoy?</p>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <div className="max-w-2xl mx-auto">
                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={() => speak('Función de ubicación actual activada')}
                                className="bg-white p-6 rounded-2xl shadow-md border-2 border-[#1B4D3E] hover:bg-gray-50 transition"
                                aria-label="Usar ubicación actual"
                            >
                                <div className="text-4xl mb-2">📍</div>
                                <p className="font-bold text-sm">Mi Ubicación</p>
                            </button>
                            <button
                                onClick={() => navigate('/trips')}
                                className="bg-white p-6 rounded-2xl shadow-md border-2 border-[#1B4D3E] hover:bg-gray-50 transition"
                                aria-label="Ver historial de viajes"
                            >
                                <div className="text-4xl mb-2">📋</div>
                                <p className="font-bold text-sm">Mis Viajes</p>
                            </button>
                        </div>

                        {/* Trip Request Form */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Solicitar Viaje
                            </h2>

                            <form onSubmit={handleRequestTrip} className="space-y-6">
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
                                    label="Detalles adicionales"
                                    icon="📝"
                                    type="text"
                                    value={tripData.details}
                                    onChange={(e) => setTripData({ ...tripData, details: e.target.value })}
                                    placeholder="Información adicional"
                                    ariaLabel="Detalles adicionales del viaje"
                                />

                                <AccessibleButton
                                    type="submit"
                                    variant="primary"
                                    icon="🚖"
                                    disabled={loading}
                                    speechText="Solicitar viaje"
                                    ariaLabel="Solicitar viaje ahora"
                                >
                                    {loading ? 'SOLICITANDO...' : 'SOLICITAR VIAJE'}
                                </AccessibleButton>
                            </form>
                        </div>

                        {/* Safety Info */}
                        <div className="mt-6 bg-yellow-50 p-4 rounded-xl border-2 border-yellow-300">
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                <span className="text-2xl">🛡️</span>
                                <span>
                                    <strong>Viaje Seguro:</strong> Todos nuestros conductores están verificados
                                    y capacitados para asistencia especializada.
                                </span>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </MainLayout>
    );
};

export default Home;