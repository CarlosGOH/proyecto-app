// frontend/src/pages/passenger/TripHistory.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import TripCard from '../../components/TripCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useSpeech } from '../../hooks/useSpeech';
import { useNavigate } from 'react-router-dom';

const TripHistory = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const { speak } = useSpeech();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTripHistory();
    }, []);

    const fetchTripHistory = async () => {
        try {
            const response = await api.get('/api/trips/history');
            setTrips(response.data);
            speak(`Tienes ${response.data.length} viajes en tu historial`);
        } catch (error) {
            console.error('Error al cargar historial:', error);
            speak('Error al cargar el historial de viajes');
        } finally {
            setLoading(false);
        }
    };

    const handleTripClick = (trip) => {
        navigate(`/trip-details/${trip.id}`);
    };

    return (
        <MainLayout pageTitle="Mis Viajes" showNav={true} showVoice={true}>
            <div className="min-h-screen">
                <header className="bg-[#1B4D3E] text-white p-6 shadow-lg">
                    <h1 className="text-3xl font-bold">Mis Viajes</h1>
                    <p className="text-green-200 mt-1">Historial completo de tus viajes</p>
                </header>

                <main className="p-6">
                    {loading ? (
                        <LoadingSpinner message="Cargando historial..." />
                    ) : trips.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🚖</div>
                            <p className="text-xl text-gray-600 mb-4">
                                Aún no has realizado ningún viaje
                            </p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="text-[#1B4D3E] font-bold underline"
                            >
                                Solicitar mi primer viaje
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-2xl mx-auto">
                            {trips.map((trip) => (
                                <TripCard
                                    key={trip.id}
                                    trip={trip}
                                    onAction={handleTripClick}
                                    actionLabel="Ver Detalles"
                                    showDetails={true}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </MainLayout>
    );
};

export default TripHistory;