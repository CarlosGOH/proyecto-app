import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Passenger Pages
import PassengerHome from './pages/passenger/Home';
import RequestTrip from './pages/passenger/RequestTrip';
import TripHistory from './pages/passenger/TripHistory';
import TripStatus from './pages/passenger/TripStatus';
import Profile from './pages/passenger/Profile';

// Driver Pages
import DriverDashboard from './pages/driver/DriverDashboard';

// Protección de Rutas
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-[#1B4D3E] font-bold text-xl">
                Cargando EyesRoute...
            </div>
        );
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Rutas Públicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Rutas Pasajero */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute allowedRoles={['vidente', 'discapacidad_visual']}>
                            <PassengerHome />
                        </ProtectedRoute>
                    } />
                    <Route path="/request-trip" element={
                        <ProtectedRoute allowedRoles={['vidente', 'discapacidad_visual']}>
                            <RequestTrip />
                        </ProtectedRoute>
                    } />
                    <Route path="/trips" element={
                        <ProtectedRoute allowedRoles={['vidente', 'discapacidad_visual']}>
                            <TripHistory />
                        </ProtectedRoute>
                    } />
                    <Route path="/trip-status/:id" element={
                        <ProtectedRoute allowedRoles={['vidente', 'discapacidad_visual']}>
                            <TripStatus />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute allowedRoles={['vidente', 'discapacidad_visual']}>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    {/* Rutas Conductor */}
                    <Route path="/driver" element={
                        <ProtectedRoute allowedRoles={['conductor']}>
                            <DriverDashboard />
                        </ProtectedRoute>
                    } />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}