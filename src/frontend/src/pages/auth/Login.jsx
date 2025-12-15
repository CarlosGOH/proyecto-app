import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AuthLayout from '../../layouts/AuthLayout';
import AccessibleInput from '../../components/AccessibleInput';
import AccessibleButton from '../../components/AccessibleButton';
import { useSpeech } from '../../hooks/useSpeech';
import { useVibration } from '../../hooks/useVibration';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { speak } = useSpeech();
    const { vibrateSuccess, vibrateError } = useVibration();

    useEffect(() => {
        speak('Bienvenido a Eyes Route. Por favor inicia sesión.');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.user, response.data.token);
            
            vibrateSuccess();
            speak(`Bienvenido ${response.data.user.name}`);
            
            // Redirección según rol
            if (response.data.user.role === 'conductor') {
                navigate('/driver');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            vibrateError();
            const errorMsg = err.response?.data?.error || 'Error de conexión';
            setError(errorMsg);
            speak(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <AccessibleInput
                    label="Correo Electrónico"
                    icon="✉️"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    ariaLabel="Ingresa tu correo electrónico"
                />

                <AccessibleInput
                    label="Contraseña"
                    icon="🔒"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    required
                    ariaLabel="Ingresa tu contraseña"
                />

                {error && (
                    <div className="bg-red-50 border-2 border-red-300 p-4 rounded-xl" role="alert">
                        <p className="text-red-700 font-semibold">{error}</p>
                    </div>
                )}

                <AccessibleButton
                    type="submit"
                    disabled={loading}
                    icon="🚀"
                    speechText="Iniciar sesión"
                >
                    {loading ? 'ENTRANDO...' : 'INICIAR SESIÓN'}
                </AccessibleButton>
            </form>

            <div className="mt-8">
                <AccessibleButton
                    variant="secondary"
                    onClick={() => navigate('/register')}
                    icon="📝"
                    speechText="Crear cuenta nueva"
                >
                    CREAR CUENTA NUEVA
                </AccessibleButton>
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    ¿Olvidaste tu contraseña?{' '}
                    <button
                        onClick={() => speak('Función de recuperación en desarrollo')}
                        className="text-[#1B4D3E] font-bold underline"
                    >
                        Recupérala aquí
                    </button>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;