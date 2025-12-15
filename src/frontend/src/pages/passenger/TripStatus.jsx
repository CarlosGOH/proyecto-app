// frontend/src/pages/passenger/TripStatus.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import AccessibleButton from '../../components/AccessibleButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useSpeech } from '../../hooks/useSpeech';
import { useVibration } from '../../hooks/useVibration';

const TripStatus = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const { speak } = useSpeech();
    const { vibrateNotification, vibrateSuccess } = useVibration();

    useEffect(() => {
        fetchTripStatus();
        const interval = setInterval(fetchTripStatus, 5000); // Polling cada 5s
        return () => clearInterval(interval);
    }, [id]);

    const fetchTripStatus = async () => {
        try {
            const response = await api.get(`/api/trips/status/${id}`);
            const tripData = response.data;
            setTrip(tripData);

            // Notificar cambios de estado
            if (tripData.status === 'en_curso' && trip?.status !== 'en_curso') {
                vibrateSuccess();
                speak(`Conductor ${tripData.driver_name} ha aceptado tu viaje y va en camino`);
            }
            if (tripData.status === 'completado' && trip?.status !== 'completado') {
                vibrateSuccess();
                speak('Tu viaje ha finalizado. Gracias por usar Eyes Route');
            }
        } catch (error) {
            console.error('Error al obtener estado:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelTrip = async () => {
        if (!confirm('¿Estás seguro de cancelar este viaje?')) return;

        try {
            await api.post('/api/trips/cancel', {
                trip_id: id,
                reason: 'Cancelado por el pasajero'
            });
            speak('Viaje cancelado exitosamente');
            navigate('/trips');
        } catch (error) {
            speak('Error al cancelar el viaje');
            console.error('Error:', error);
        }
    };

    const handleRateDriver = () => {
        navigate(`/rate-trip/${id}`);
    };

    if (loading) {
        return (
            <MainLayout pageTitle="Estado del Viaje">
                <LoadingSpinner message="Cargando información del viaje..." />
            </MainLayout>
        );
    }

    const statusInfo = {
        pendiente: {
            icon: '🔍',
            title: 'Buscando Conductor',
            message: 'Estamos buscando un conductor cerca de ti...',
            color: 'bg-yellow-500'
        },
        en_curso: {
            icon: '🚗',
            title: 'Viaje en Curso',
            message: 'Tu conductor va en camino',
            color: 'bg-blue-500'
        },
        completado: {
            icon: '✅',
            title: 'Viaje Completado',
            message: '¡Has llegado a tu destino!',
            color: 'bg-green-500'
        },
        cancelado: {
            icon: '❌',
            title: 'Viaje Cancelado',
            message: 'Este viaje ha sido cancelado',
            color: 'bg-red-500'
        }
    };

    const currentStatus = statusInfo[trip?.status] || statusInfo.pendiente;

    return (
        <MainLayout pageTitle="Estado del Viaje" showNav={false} showVoice={true}>
            <div className="min-h-screen bg-gray-50">
                {/* Status Header */}
                <div className={`${currentStatus.color} text-white p-8 text-center`}>
                    <div className="text-6xl mb-4">{currentStatus.icon}</div>
                    <h1 className="text-3xl font-bold mb-2">{currentStatus.title}</h1>
                    <p className="text-xl">{currentStatus.message}</p>
                </div>

                {/* Trip Details */}
                <div className="p-6 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Detalles del Viaje
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 font-semibold">ORIGEN</p>
                                <p className="text-lg text-gray-900">{trip?.origin}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-semibold">DESTINO</p>
                                <p className="text-lg text-gray-900">{trip?.destination}</p>
                            </div>
                            {trip?.driver_name && (
                                <div>
                                    <p className="text-sm text-gray-600 font-semibold">CONDUCTOR</p>
                                    <p className="text-lg text-gray-900">{trip.driver_name}</p>
                                    {trip.driver_phone && (
                                        <a
                                            href={`tel:${trip.driver_phone}`}
                                            className="text-[#1B4D3E] font-bold underline"
                                        >
                                            📞 {trip.driver_phone}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Simulated Map */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl mb-2">🗺️</div>
                                <p className="text-gray-600">Mapa del Viaje</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    (Simulación - En producción se usaría Google Maps)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        {trip?.status === 'pendiente' && (
                            <AccessibleButton
                                variant="danger"
                                icon="❌"
                                onClick={handleCancelTrip}
                                speechText="Cancelar viaje"
                            >
                                CANCELAR VIAJE
                            </AccessibleButton>
                        )}

                        {trip?.status === 'completado' && (
                            <AccessibleButton
                                variant="primary"
                                icon="⭐"
                                onClick={handleRateDriver}
                                speechText="Calificar conductor"
                            >
                                CALIFICAR CONDUCTOR
                            </AccessibleButton>
                        )}

                        <AccessibleButton
                            variant="secondary"
                            icon="🏠"
                            onClick={() => navigate('/dashboard')}
                            speechText="Volver al inicio"
                        >
                            VOLVER AL INICIO
                        </AccessibleButton>
                    </div>

                    {/* Emergency Button */}
                    <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-300">
                        <AccessibleButton
                            variant="danger"
                            icon="🚨"
                            onClick={() => {
                                vibrateNotification();
                                speak('Botón de emergencia activado. Contactando autoridades.');
                                alert('En una app real, esto contactaría servicios de emergencia');
                            }}
                            speechText="Botón de emergencia"
                        >
                            EMERGENCIA
                        </AccessibleButton>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default TripStatus;