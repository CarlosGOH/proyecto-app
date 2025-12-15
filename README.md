# 👁️ EyesRoute

**EyesRoute** es una aplicación de apoyo y transporte inclusivo diseñada especialmente para **personas con discapacidad visual**, permitiendo solicitar servicios de transporte de forma segura, accesible y asistida por tecnologías como **comandos de voz, alertas auditivas y vibración**.

Este proyecto fue desarrollado como parte del **Laboratorio de Diseño de Software** del programa **Tecnología en Desarrollo de Software** de la **Universidad del Valle – Sede Norte del Cauca**.

---

## 📌 Descripción General

EyesRoute busca mejorar la movilidad y autonomía de las personas con discapacidad visual mediante una aplicación móvil que integra:

* Geolocalización en tiempo real
* Solicitud de transporte asistida por voz
* Alertas de seguridad accesibles
* Pagos en línea
* Gestión de usuarios, conductores y administración

La aplicación también puede ser utilizada por **usuarios sin discapacidad visual**, conductores y un administrador del sistema.

---

## 🎯 Objetivo del Proyecto

Desarrollar una solución de transporte accesible que garantice **inclusión, seguridad y usabilidad**, priorizando las necesidades de personas con discapacidad visual, sin excluir a otros tipos de usuarios.

---

## 👥 Actores del Sistema

### 👤 Usuario con discapacidad visual

* Navegación completa por **comandos de voz**.
* Retroalimentación mediante **audio y vibración**.
* Compartir ruta en tiempo real con contactos externos.
* Alertas de seguridad por zonas de riesgo.
* Activación de la app mediante **gesto físico**.
* Gestión de perfil y conductores favoritos.

### 👤 Usuario sin discapacidad visual

* Solicitud de servicios de transporte.
* Gestión de métodos de pago.
* Guardado de rutas frecuentes.
* Visualización de información del vehículo.
* Calificación del servicio.

### 🚗 Conductor

* Recepción de solicitudes de viaje.
* Aceptar o rechazar servicios.
* Visualización de rutas optimizadas.
* Mensajería con el cliente.
* Historial de viajes y calificación de usuarios.

### 🛠 Administrador

* Gestión de usuarios y conductores.
* Aprobación y validación de registros.
* Configuración de tarifas y métodos de pago.
* Generación de reportes y estadísticas.
* Creación de avisos globales para los usuarios.

---

## ⚙️ Funcionalidades Principales

* 📍 Solicitud de transporte por voz o interfaz gráfica
* 🔊 Accesibilidad total (voz, vibración, gestos)
* 🗺️ Geolocalización y rutas seguras
* 💳 Pagos en línea mediante pasarela de pago
* ⭐ Sistema de calificaciones y reseñas
* 📊 Panel administrativo con estadísticas

---

## 🧱 Arquitectura del Sistema

### 📐 Arquitectura en Capas (N-Tier)

* **Capa de Presentación (Front-End):** React.js
* **Capa de Aplicación (Back-End):** Node.js (Modelo MVC)
* **Capa de Datos:**

  * PostgreSQL (datos principales)
  * NoSQL (historiales y sincronización)

### 🧩 Patrones de Diseño Utilizados

* **Factory Pattern** – Creación de objetos (usuarios, viajes, pagos)
* **Singleton Pattern** – Conexión a la base de datos
* **Repository Pattern** – Acceso centralizado a datos
* **Adapter Pattern** – Integración con servicios externos

---

## 🧪 Metodología de Desarrollo

* **Modelo de Desarrollo:** Incremental
* **Metodología:** Ágil – Scrum
* Desarrollo por sprints con retroalimentación continua
* Enfoque en pruebas reales de accesibilidad

---

## 🗂️ Estructura del Proyecto

```text
proyecto-app/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── config/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── assets/
│
├── database/
│   ├── postgres/
│   └── nosql/
│
├── docs/
│   └── Documentacion completa EyesRoute.pdf
│
└── README.md
```

---

## 🔐 Requisitos No Funcionales Destacados

* Comunicación cifrada mediante **HTTPS**
* Autenticación y autorización por roles
* Tiempo de respuesta ≤ 3 segundos
* Integración con lectores de pantalla
* Escalabilidad y mantenibilidad del sistema

---

## 📚 Documentación

La documentación completa del proyecto (SRS, casos de uso, arquitectura, trazabilidad y glosario) se encuentra en:

📄 **Documentacion completa EyesRoute.pdf**

---

## 👨‍💻 Autores

* **Carlos Julián Gonzales Hoyos**
* **Jarryson Steven Medina Noscue**

---

## 🏫 Institución

Universidad del Valle
Sede Norte del Cauca
Facultad de Ingeniería
Tecnología en Desarrollo de Software

---

## 📄 Licencia

Este proyecto fue desarrollado con fines **académicos**. Su uso y distribución están sujetos a las políticas de la Universidad del Valle.

---

⭐ *Proyecto académico enfocado en accesibilidad, inclusión y diseño de software centrado en el usuario.*


