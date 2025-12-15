// frontend/src/pages/driver/DriverDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../../layouts/MainLayout';
import AccessibleButton from '../../components/AccessibleButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useSpeech } from '../../hooks/useSpeech';
import { useVibration } from '../../hooks/useVibration';

const DriverDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { speak } = useSpeech();
    const { vibrateSuccess, vibrateNotification } = useVibration();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        speak(`Bienvenido conductor ${user?.name}. Panel de control cargado.`);
        fetchPendingTrips();
        const interval = setInterval(fetchPendingTrips, 5000); // Polling cada 5s
        return () => clearInterval(interval);
    }, []);

    const fetchPendingTrips = async () => {
        try {
            const response = await api.get('/api/trips/pending');
            const newTrips = response.data;
            
            // Notificar si hay nuevos viajes
            if (newTrips.length > trips.length && trips.length > 0) {
                vibrateNotification();
                speak('Nueva solicitud de viaje disponible');
            }
            
            setTrips(newTrips);
        } catch (error) {
            console.error('Error al cargar viajes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptTrip = async (tripId) => {
        try {
            await api.patch('/api/trips/update-status', { 
                trip_id: tripId, 
                action: 'aceptar' 
            });
            vibrateSuccess();
            speak('Viaje aceptado exitosamente. Ve por el pasajero.');
            fetchPendingTrips();
        } catch (error) {
            speak('Error al aceptar el viaje');
            console.error('Error:', error);
        }
    };

    const handleToggleOnline = () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);
        speak(newStatus ? 'Ahora estás en línea' : 'Ahora estás fuera de línea');
        vibrateNotification();
    };

    const handleLogout = () => {
        speak('Cerrando sesión');
        setTimeout(() => {
            logout();
            navigate('/login');
        }, 1000);
    };

    if (loading) {
        return (
            <MainLayout pageTitle="Panel de Conductor">
                <LoadingSpinner message="Cargando solicitudes..." />
            </MainLayout>
        );
    }

    return (
        <MainLayout pageTitle="Panel de Conductor" showNav={false} showVoice={true}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-[#1B4D3E] text-white p-6 shadow-lg sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Panel de Conductor</h1>
                            <p className="text-green-200 text-sm mt-1">
                                {isOnline ? '🟢 En línea' : '🔴 Fuera de línea'} - {user?.name}
                            </p>
                        </div>
                        <button
                            onClick={handleToggleOnline}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                                isOnline 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                            aria-label={isOnline ? 'Ponerse fuera de línea' : 'Ponerse en línea'}
                        >
                            {isOnline ? 'IR OFFLINE' : 'IR ONLINE'}
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Solicitudes Disponibles ({trips.length})
                            </h2>
                            <button
                                onClick={fetchPendingTrips}
                                className="text-[#1B4D3E] font-bold underline"
                                aria-label="Actualizar lista de viajes"
                            >
                                🔄 Actualizar
                            </button>
                        </div>

                        {!isOnline && (
                            <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-xl mb-6">
                                <p className="text-yellow-800 font-semibold flex items-center gap-2">
                                    <span className="text-2xl">⚠️</span>
                                    Estás fuera de línea. Activa el modo en línea para recibir solicitudes.
                                </p>
                            </div>
                        )}

                        {trips.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">📡</div>
                                <p className="text-xl text-gray-600 mb-2">
                                    {isOnline ? 'Esperando solicitudes...' : 'No estás en línea'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Las nuevas solicitudes aparecerán aquí automáticamente
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {trips.map((trip) => (
                                    <div
                                        key={trip.id}
                                        className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-[#1B4D3E] transition"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-[#1B4D3E]">
                                                    {trip.passenger_name}
                                                </h3>
                                                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-bold mt-2">
                                                    ♿ Requiere Asistencia
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-bold text-gray-800">
                                                    $15.000
                                                </p>
                                                <p className="text-xs text-gray-500">Estimado</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 border-t pt-4">
                                            <div className="flex items-start gap-3">
                                                <span className="text-green-600 font-bold text-lg">📍</span>
                                                <div>
                                                    <p className="text-xs text-gray-600 font-semibold">ORIGEN</p>
                                                    <p className="text-gray-800 font-medium">{trip.origin}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-red-600 font-bold text-lg">🏁</span>
                                                <div>
                                                    <p className="text-xs text-gray-600 font-semibold">DESTINO</p>
                                                    <p className="text-gray-800 font-medium">{trip.destination}</p>
                                                </div>
                                            </div>
                                            {trip.details && (
                                                <div className="flex items-start gap-3">
                                                    <span className="text-blue-600 font-bold text-lg">📝</span>
                                                    <div>
                                                        <p className="text-xs text-gray-600 font-semibold">DETALLES</p>
                                                        <p className="text-gray-800 font-medium">{trip.details}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {trip.passenger_phone && (
                                                <div className="flex items-start gap-3">
                                                    <span className="text-purple-600 font-bold text-lg">📞</span>
                                                    <div>
                                                        <p className="text-xs text-gray-600 font-semibold">CONTACTO</p>
                                                        <a
                                                            href={`tel:${trip.passenger_phone}`}
                                                            className="text-[#1B4D3E] font-bold underline"
                                                        >
                                                            {trip.passenger_phone}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6">
                                            <AccessibleButton
                                                variant="primary"
                                                icon="✅"
                                                onClick={() => handleAcceptTrip(trip.id)}
                                                speechText="Aceptar viaje"
                                                disabled={!isOnline}
                                            >
                                                ACEPTAR VIAJE
                                            </AccessibleButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="mt-8 space-y-4">
                            <AccessibleButton
                                variant="secondary"
                                icon="📋"
                                onClick={() => navigate('/driver/history')}
                                speechText="Ver historial de viajes"
                            >
                                VER HISTORIAL
                            </AccessibleButton>
                            <AccessibleButton
                                variant="secondary"
                                icon="👤"
                                onClick={() => navigate('/profile')}
                                speechText="Ver perfil"
                            >
                                MI PERFIL
                            </AccessibleButton>
                            <AccessibleButton
                                variant="danger"
                                icon="🚪"
                                onClick={handleLogout}
                                speechText="Cerrar sesión"
                            >
                                CERRAR SESIÓN
                            </AccessibleButton>
                        </div>
                    </div>
                </main>
            </div>
        </MainLayout>
    );
};

export default DriverDashboard;