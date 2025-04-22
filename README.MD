# Ymir's Store API

**ESPAÑOL / ENGLISH**

---

## 🌐 Introducción / Introduction

**ES:** Ymir's Store API es el backend de una tienda de comercio electrónico especializada en productos medievales y de fantasía. Está desplegada y funcionando en producción en: **[ymir.up.railway.app](https://ymir.up.railway.app)**. Esta API demuestra el uso combinado de múltiples tecnologías modernas del ecosistema JavaScript, manejo de lógica de negocio, estructuración profesional de proyectos y experiencia real en desarrollo full stack.

**EN:** Ymir's Store API is the backend of an e-commerce store focused on medieval and fantasy products. It is deployed and running in production at: **[ymir.up.railway.app](https://ymir.up.railway.app)**. This API showcases the combined use of modern JavaScript ecosystem technologies, business logic handling, professional project structuring, and real-world full stack development experience.

---

## 🚀 Tecnologías Utilizadas / Technologies Used

- **Node.js + Express.js** – Backend robusto y modular / Robust and modular backend
- **MongoDB + Mongoose** – Base de datos NoSQL / NoSQL database
- **Passport.js** – Autenticación local y con GitHub / Local and GitHub authentication
- **JWT** – Gestión segura de sesiones / Secure session handling
- **Socket.io** – Comunicación en tiempo real / Real-time communication
- **MercadoPago SDK** – Integración completa de pagos / Full payment integration
- **Nodemailer** – Envío de correos electrónicos (recuperación, compra, etc.) / Email services (recovery, purchases, etc.)
- **Handlebars** – Plantillas de emails personalizadas / Custom email templates
- **Swagger** – Documentación de la API / API documentation
- **Winston** – Registro de logs avanzados / Advanced logging system

---

## 🔍 Características Principales / Key Features

- Autenticación de usuarios (local y GitHub)
- Registro y login con validaciones personalizadas
- CRUD de productos con control de permisos (usuarios y admins)
- Gestión avanzada de carritos y órdenes de compra
- Pasarela de pagos integrada con MercadoPago (incluyendo webhooks y validaciones)
- Generación de tickets y actualización automática del stock
- Sistema de mensajería en tiempo real con WebSockets
- Envío de correos HTML estilizados ante distintas acciones del usuario
- Logging con diferentes niveles y archivos de salida
- Documentación dinámica y navegable con Swagger
- Arquitectura escalable basada en capas (routers, controllers, services, DAO)

---

## 📂 Estructura Profesional del Proyecto / Professional Project Structure

```
src/
├── app.js
├── config/              # Configuración general / App config
├── controllers/         # Controladores HTTP / HTTP controllers
├── dao/                 # Capa de acceso a datos / Data Access Layer
├── middlewares/         # Middlewares personalizados / Custom middlewares
├── models/              # Modelos de Mongoose / Mongoose models
├── routes/              # Rutas del servidor / API routes
├── services/            # Lógica de negocio / Business logic
├── utils/               # Utilidades generales / General utilities
├── views/               # Templates de correos electrónicos / Email templates
├── logs/                # Archivos de logs / Log files
```

---

## 📄 Endpoints Destacados / Featured Endpoints

**ES:** A continuación, algunos de los endpoints clave que ilustran el uso de la API. Para ver toda la documentación técnica, visitar `/api/docs`.

**EN:** Below are some key endpoints showcasing the API's functionality. For full technical documentation, visit `/api/docs`.

### Productos / Products
- `GET /api/products` — Lista todos los productos / Lists all products
- `GET /api/products/:pid` — Producto por ID / Product by ID
- `POST /api/products` — Crear nuevo producto (solo admins) / Create product (admins only)

### Carrito de Compras / Shopping Cart
- `POST /api/carts` — Crear nuevo carrito / Create new cart
- `PUT /api/carts/:cid` — Actualizar contenido del carrito / Update cart content
- `POST /api/carts/:cid/purchase` — Iniciar compra vía MercadoPago / Start purchase via MercadoPago

### Sesiones / Sessions
- `POST /api/sessions/login` — Iniciar sesión / Login
- `POST /api/sessions/register` — Registro de usuario / Register
- `GET /api/sessions/github` — Login con GitHub / GitHub login

---

## 🛡️ Seguridad y Manejo de Sesiones / Security & Session Handling

**ES:** Autenticación basada en JWT para sesiones locales. GitHub OAuth integrado. Protección de rutas por rol (usuario o administrador).

**EN:** JWT-based authentication for local sessions. GitHub OAuth integrated. Role-based route protection (user or admin).

---

## 📨 Emails Automatizados / Automated Emails

**ES:** Correos enviados en eventos clave: registro, recuperación de contraseña, confirmación de compra, cambios de estado del pedido. Estilizados con Handlebars.

**EN:** Emails sent on key events: registration, password recovery, purchase confirmation, order status updates. Styled with Handlebars.

---

## 🔧 Logging Avanzado / Advanced Logging

**ES:** Sistema de logging con Winston. Guarda logs de errores y logs combinados por niveles de severidad.

**EN:** Logging system using Winston. Saves error logs and combined logs by severity level.

---

## 📚 Documentación con Swagger / Swagger Documentation

**Disponible en:** `/api/docs`
**Available at:** `/api/docs`

---

## 📈 Para Empleadores y Clientes / For Employers and Clients

**ES:** Este proyecto demuestra:
- Capacidad de estructurar proyectos Node.js 
- Dominio de APIs RESTful con control de acceso y validación
- Integración con servicios externos como MercadoPago y Nodemailer
- Habilidades de debugging y logging con buenas prácticas
- Capacidad para desplegar en producción y manejar entornos complejos

**EN:** This project demonstrates:
- Ability to structure Node.js projects
- Mastery of RESTful APIs with access control and validation
- Integration with external services such as MercadoPago and Nodemailer
- Debugging and logging skills following best practices
- Production deployment and management of complex environments

---

### 🌟 Creado con pasión por Ezequiel Arraygada / Created with passion by Ezequiel Arraygada

> Un alma medieval en un mundo digital / A medieval soul in a digital world

🌍 API en producción: **https://ymir.up.railway.app**