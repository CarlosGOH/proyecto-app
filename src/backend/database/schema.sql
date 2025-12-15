-- =====================================================
-- EYESROUTE DATABASE SCHEMA
-- Sistema de transporte accesible para personas con discapacidad visual
-- =====================================================

-- Eliminar tablas si existen (para desarrollo)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- TABLA: users
-- Almacena información de usuarios (pasajeros, conductores, admin)
-- =====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL CHECK (role IN ('discapacidad_visual', 'vidente', 'conductor', 'admin')),
    profile_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- TABLA: trips
-- Almacena información de viajes solicitados
-- =====================================================
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    passenger_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    driver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    details TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pendiente' 
        CHECK (status IN ('pendiente', 'en_curso', 'completado', 'cancelado')),
    cancellation_reason TEXT,
    cancelled_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    estimated_price DECIMAL(10, 2),
    final_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_trips_passenger ON trips(passenger_id);
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_created ON trips(created_at DESC);

-- =====================================================
-- TABLA: payments
-- Almacena información de pagos realizados
-- =====================================================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('efectivo', 'tarjeta', 'transferencia')),
    status VARCHAR(50) NOT NULL DEFAULT 'pendiente' 
        CHECK (status IN ('pendiente', 'completado', 'fallido', 'reembolsado')),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_payments_trip ON payments(trip_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- =====================================================
-- TABLA: reviews
-- Almacena reseñas y calificaciones de viajes
-- =====================================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trip_id, reviewer_id)
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_reviews_trip ON reviews(trip_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id);

-- =====================================================
-- TRIGGERS PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- =====================================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para trips
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para payments
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para reviews
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS DE PRUEBA (OPCIONAL)
-- =====================================================

-- Usuario Admin (contraseña: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin EyesRoute', 'admin@eyesroute.com', '$2a$10$YourHashedPasswordHere', 'admin');

-- Conductor de prueba (contraseña: conductor123)
INSERT INTO users (name, email, password_hash, phone, role) VALUES 
('Juan Conductor', 'conductor@test.com', '$2a$10$YourHashedPasswordHere', '+52 555 1234567', 'conductor');

-- Pasajero con discapacidad visual (contraseña: pasajero123)
INSERT INTO users (name, email, password_hash, phone, role) VALUES 
('María Pasajera', 'pasajero@test.com', '$2a$10$YourHashedPasswordHere', '+52 555 7654321', 'discapacidad_visual');

-- =====================================================
-- COMENTARIOS Y NOTAS
-- =====================================================

-- ROLES:
-- - discapacidad_visual: Usuario con discapacidad visual que solicita viajes
-- - vidente: Usuario sin discapacidad visual que solicita viajes
-- - conductor: Usuario que acepta y realiza viajes
-- - admin: Administrador del sistema

-- ESTADOS DE VIAJE:
-- - pendiente: Viaje solicitado, esperando conductor
-- - en_curso: Viaje aceptado por conductor, en progreso
-- - completado: Viaje finalizado exitosamente
-- - cancelado: Viaje cancelado por pasajero o conductor

-- MÉTODOS DE PAGO:
-- - efectivo: Pago en efectivo al finalizar viaje
-- - tarjeta: Pago con tarjeta de crédito/débito
-- - transferencia: Pago por transferencia bancaria

-- ESTADOS DE PAGO:
-- - pendiente: Pago no realizado
-- - completado: Pago realizado exitosamente
-- - fallido: Pago rechazado o fallido
-- - reembolsado: Pago devuelto al usuario