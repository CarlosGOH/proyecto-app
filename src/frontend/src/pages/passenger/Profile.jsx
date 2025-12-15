// frontend/src/pages/passenger/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../../layouts/MainLayout';
import AccessibleButton from '../../components/AccessibleButton';
import AccessibleInput from '../../components/AccessibleInput';
import { useSpeech } from '../../hooks/useSpeech';
import { useAccessibility } from '../../hooks/useAccessibility';
import api from '../../services/api';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { speak } = useSpeech();
    const { preferences, updatePreference } = useAccessibility();
    const [activeSection, setActiveSection] = useState('datos');
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        emergency_contact: '',
        photo_url: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/api/users/me');
            setProfileData(response.data);
        } catch (error) {
            console.error('Error al cargar perfil:', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put('/api/users/profile', profileData);
            speak('Perfil actualizado exitosamente');
        } catch (error) {
            speak('Error al actualizar perfil');
            console.error('Error:', error);
        }
    };

    const handleLogout = () => {
        speak('Cerrando sesión. Hasta pronto.');
        setTimeout(() => {
            logout();
            navigate('/login');
        }, 1000);
    };

    const sections = [
        { id: 'datos', label: 'Datos', icon: '👤' },
        { id: 'seguridad', label: 'Seguridad', icon: '🔒' },
        { id: 'personalizacion', label: 'Personalización', icon: '🎨' },
        { id: 'pagos', label: 'Pagos', icon: '💳' },
        { id: 'soporte', label: 'Soporte', icon: '💬' }
    ];

    return (
        <MainLayout pageTitle="Mi Perfil" showNav={true} showVoice={true}>
            <div className="min-h-screen">
                <header className="bg-[#1B4D3E] text-white p-6 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl">
                            {profileData.photo_url ? (
                                <img src={profileData.photo_url} alt="Foto de perfil" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                '👤'
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user?.name}</h1>
                            <p className="text-green-200">{user?.email}</p>
                        </div>
                    </div>
                </header>

                {/* Section Tabs */}
                <div className="bg-white border-b overflow-x-auto">
                    <div className="flex">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => {
                                    setActiveSection(section.id);
                                    speak(section.label);
                                }}
                                className={`flex-1 min-w-[100px] py-4 px-2 text-center font-bold transition ${
                                    activeSection === section.id
                                        ? 'bg-[#1B4D3E] text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                aria-label={section.label}
                            >
                                <div className="text-2xl mb-1">{section.icon}</div>
                                <div className="text-xs">{section.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <main className="p-6">
                    {activeSection === 'datos' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Datos Personales</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <AccessibleInput
                                    label="Nombre Completo"
                                    icon="👤"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                />
                                <AccessibleInput
                                    label="Correo Electrónico"
                                    icon="✉️"
                                    type="email"
                                    value={profileData.email}
                                    disabled
                                />
                                <AccessibleInput
                                    label="Teléfono"
                                    icon="📱"
                                    type="tel"
                                    value={profileData.phone || ''}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                />
                                <AccessibleInput
                                    label="Edad"
                                    icon="🎂"
                                    type="number"
                                    value={profileData.age || ''}
                                    onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                                />
                                <AccessibleInput
                                    label="Contacto de Emergencia"
                                    icon="🚨"
                                    type="tel"
                                    value={profileData.emergency_contact || ''}
                                    onChange={(e) => setProfileData({ ...profileData, emergency_contact: e.target.value })}
                                />
                                <AccessibleButton type="submit" icon="💾" speechText="Guardar cambios">
                                    GUARDAR CAMBIOS
                                </AccessibleButton>
                            </form>
                        </div>
                    )}

                    {activeSection === 'personalizacion' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Personalización</h2>
                            
                            <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
                                <div>
                                    <label className="block text-lg font-bold text-gray-700 mb-3">
                                        Tamaño de Letra
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['small', 'medium', 'large'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => updatePreference('fontSize', size)}
                                                className={`py-3 px-4 rounded-xl font-bold transition ${
                                                    preferences.fontSize === size
                                                        ? 'bg-[#1B4D3E] text-white'
                                                        : 'bg-gray-200 text-gray-700'
                                                }`}
                                            >
                                                {size === 'small' ? 'A' : size === 'medium' ? 'A+' : 'A++'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-bold text-gray-700 mb-3">
                                        Contraste
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['normal', 'high', 'highest'].map((contrast) => (
                                            <button
                                                key={contrast}
                                                onClick={() => updatePreference('contrast', contrast)}
                                                className={`py-3 px-4 rounded-xl font-bold transition ${
                                                    preferences.contrast === contrast
                                                        ? 'bg-[#1B4D3E] text-white'
                                                        : 'bg-gray-200 text-gray-700'
                                                }`}
                                            >
                                                {contrast === 'normal' ? 'Normal' : contrast === 'high' ? 'Alto' : 'Máximo'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-bold text-gray-700 mb-3">
                                        Brillo
                                    </label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {['low', 'normal', 'high', 'highest'].map((brightness) => (
                                            <button
                                                key={brightness}
                                                onClick={() => updatePreference('brightness', brightness)}
                                                className={`py-3 px-4 rounded-xl font-bold transition ${
                                                    preferences.brightness === brightness
                                                        ? 'bg-[#1B4D3E] text-white'
                                                        : 'bg-gray-200 text-gray-700'
                                                }`}
                                            >
                                                {brightness === 'low' ? '🌑' : brightness === 'normal' ? '🌓' : brightness === 'high' ? '🌕' : '☀️'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-bold text-gray-700 mb-3">
                                        Voz del Asistente
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['female', 'male'].map((voice) => (
                                            <button
                                                key={voice}
                                                onClick={() => updatePreference('voiceGender', voice)}
                                                className={`py-3 px-4 rounded-xl font-bold transition ${
                                                    preferences.voiceGender === voice
                                                        ? 'bg-[#1B4D3E] text-white'
                                                        : 'bg-gray-200 text-gray-700'
                                                }`}
                                            >
                                                {voice === 'female' ? '👩 Mujer' : '👨 Hombre'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'pagos' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Métodos de Pago</h2>
                            <div className="bg-white p-6 rounded-2xl shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl">💳</div>
                                        <div>
                                            <p className="font-bold">Google Pay</p>
                                            <p className="text-sm text-gray-600">Método predeterminado</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                                        ACTIVO
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 italic">
                                    (Simulado - En producción se integraría con pasarelas de pago reales)
                                </p>
                            </div>
                        </div>
                    )}

                    {activeSection === 'soporte' && (
                        <div className="max-w-2xl mx-auto space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Soporte</h2>
                            <AccessibleButton
                                icon="💬"
                                onClick={() => speak('Función de chat en desarrollo')}
                                speechText="Chat con asesor"
                            >
                                CHAT CON ASESOR
                            </AccessibleButton>
                            <AccessibleButton
                                icon="📞"
                                variant="secondary"
                                onClick={() => speak('Función de llamada en desarrollo')}
                                speechText="Llamar a soporte"
                            >
                                LLAMAR A SOPORTE
                            </AccessibleButton>
                            <AccessibleButton
                                icon="📝"
                                variant="secondary"
                                onClick={() => navigate('/support/pqrs')}
                                speechText="Enviar PQRS"
                            >
                                ENVIAR PQRS
                            </AccessibleButton>
                        </div>
                    )}

                    {activeSection === 'seguridad' && (
                        <div className="max-w-2xl mx-auto space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Seguridad</h2>
                            <AccessibleButton
                                icon="🔒"
                                variant="secondary"
                                onClick={() => navigate('/change-password')}
                                speechText="Cambiar contraseña"
                            >
                                CAMBIAR CONTRASEÑA
                            </AccessibleButton>
                            <AccessibleButton
                                icon="✉️"
                                variant="secondary"
                                onClick={() => navigate('/change-email')}
                                speechText="Cambiar correo"
                            >
                                CAMBIAR CORREO
                            </AccessibleButton>
                        </div>
                    )}

                    {/* Logout Button */}
                    <div className="max-w-2xl mx-auto mt-8">
                        <AccessibleButton
                            variant="danger"
                            icon="🚪"
                            onClick={handleLogout}
                            speechText="Cerrar sesión"
                        >
                            CERRAR SESIÓN
                        </AccessibleButton>
                    </div>
                </main>
            </div>
        </MainLayout>
    );
};

export default Profile;