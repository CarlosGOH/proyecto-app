import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AuthLayout from '../../layouts/AuthLayout';
import AccessibleInput from '../../components/AccessibleInput';
import AccessibleButton from '../../components/AccessibleButton';
import { useSpeech } from '../../hooks/useSpeech';
import { useVibration } from '../../hooks/useVibration';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'discapacidad_visual'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { speak } = useSpeech();
    const { vibrateSuccess, vibrateError } = useVibration();

    useEffect(() => {
        speak('Formulario de registro. Por favor completa tus datos.');
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validaciones
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            speak('La contraseña debe tener al menos 6 caracteres');
            vibrateError();
            setLoading(false);
            return;
        }

        try {
            await api.post('/auth/register', formData);
            vibrateSuccess();
            speak('Registro exitoso. Redirigiendo al inicio de sesión.');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            vibrateError();
            const msg = err.response?.data?.error || 'Error de conexión o datos inválidos.';
            setError(msg);
            speak(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <AccessibleInput
                    label="Nombre Completo"
                    icon="👤"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    required
                    ariaLabel="Ingresa tu nombre completo"
                />

                <AccessibleInput
                    label="Correo Electrónico"
                    icon="✉️"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                    ariaLabel="Ingresa tu correo electrónico"
                />

                <AccessibleInput
                    label="Contraseña"
                    icon="🔒"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    required
                    ariaLabel="Crea una contraseña segura"
                />

                <div>
                    <label className="block text-lg font-bold text-gray-700 mb-3">
                        <span className="mr-2">👥</span>
                        Tipo de Usuario
                    </label>
                    <div className="space-y-3">
                        <label className="flex items-center p-4 bg-white border-2 border-gray-300 rounded-xl cursor-pointer hover:border-[#1B4D3E] transition">
                            <input
                                type="radio"
                                name="role"
                                value="discapacidad_visual"
                                checked={formData.role === 'discapacidad_visual'}
                                onChange={handleChange}
                                className="w-6 h-6 text-[#1B4D3E]"
                            />
                            <span className="ml-3 text-lg font-semibold">
                                Usuario con Discapacidad Visual
                            </span>
                        </label>
                        <label className="flex items-center p-4 bg-white border-2 border-gray-300 rounded-xl cursor-pointer hover:border-[#1B4D3E] transition">
                            <input
                                type="radio"
                                name="role"
                                value="vidente"
                                checked={formData.role === 'vidente'}
                                onChange={handleChange}
                                className="w-6 h-6 text-[#1B4D3E]"
                            />
                            <span className="ml-3 text-lg font-semibold">
                                Usuario Vidente
                            </span>
                        </label>
                        <label className="flex items-center p-4 bg-white border-2 border-gray-300 rounded-xl cursor-pointer hover:border-[#1B4D3E] transition">
                            <input
                                type="radio"
                                name="role"
                                value="conductor"
                                checked={formData.role === 'conductor'}
                                onChange={handleChange}
                                className="w-6 h-6 text-[#1B4D3E]"
                            />
                            <span className="ml-3 text-lg font-semibold">
                                Conductor
                            </span>
                        </label>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-2 border-red-300 p-4 rounded-xl" role="alert">
                        <p className="text-red-700 font-semibold">{error}</p>
                    </div>
                )}

                <AccessibleButton
                    type="submit"
                    disabled={loading}
                    icon="📝"
                    speechText="Registrarse"
                >
                    {loading ? 'REGISTRANDO...' : 'REGISTRARSE'}
                </AccessibleButton>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-[#1B4D3E] font-bold underline"
                    >
                        Inicia Sesión
                    </button>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Register;