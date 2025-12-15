// frontend/src/components/TripCard.jsx
import React from 'react';
import { useSpeech } from '../hooks/useSpeech';
import AccessibleButton from './AccessibleButton';

const TripCard = ({ trip, onAction, actionLabel, showDetails = true }) => {
    const { speak } = useSpeech();

    const statusColors = {
        pendiente: 'bg-yellow-100 text-yellow-800',
        en_curso: 'bg-blue-100 text-blue-800',
        completado: 'bg-green-100 text-green-800',
        cancelado: 'bg-red-100 text-red-800'
    };

    const statusLabels = {
        pendiente: 'Pendiente',
        en_curso: 'En Curso',
        completado: 'Completado',
        cancelado: 'Cancelado'
    };

    const handleCardClick = () => {
        const text = `Viaje desde ${trip.origin} hasta ${trip.destination}. Estado: ${statusLabels[trip.status]}`;
        speak(text);
    };

    return (
        <div 
            className="card-accessible cursor-pointer hover:shadow-xl transition-shadow"
            onClick={handleCardClick}
            role="article"
            aria-label={`Viaje desde ${trip.origin} hasta ${trip.destination}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#1B4D3E] mb-2">
                        Viaje #{trip.id?.toString().slice(-6)}
                    </h3>
                    <span className={`${statusColors[trip.status]} text-xs px-3 py-1 rounded-full font-bold`}>
                        {statusLabels[trip.status]}
                    </span>
                </div>
                {trip.amount && (
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">
                            ${trip.amount?.toLocaleString()}
                        </p>
                    </div>
                )}
            </div>

            {showDetails && (
                <div className="space-y-3 border-t pt-4 mt-4">
                    <div className="flex items-start gap-2">
                        <span className="text-green-700 font-bold text-sm">DESDE:</span>
                        <p className="text-gray-800 flex-1">{trip.origin}</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-red-700 font-bold text-sm">HASTA:</span>
                        <p className="text-gray-800 flex-1">{trip.destination}</p>
                    </div>
                    {trip.driver_name && (
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">CONDUCTOR:</span>
                            <p className="text-gray-800">{trip.driver_name}</p>
                        </div>
                    )}
                    {trip.passenger_name && (
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">PASAJERO:</span>
                            <p className="text-gray-800">{trip.passenger_name}</p>
                        </div>
                    )}
                </div>
            )}

            {onAction && actionLabel && (
                <div className="mt-4">
                    <AccessibleButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(trip);
                        }}
                        speechText={actionLabel}
                    >
                        {actionLabel}
                    </AccessibleButton>
                </div>
            )}
        </div>
    );
};

export default TripCard;