YmirShop

YmirShop es una aplicación web de comercio electrónico desarrollada con una arquitectura Full Stack,
que ofrece una experiencia completa de navegación de productos y compras para los usuarios. La tienda 
está diseñada para que los usuarios puedan explorar productos sin necesidad de iniciar sesión, aunque 
es necesario estar registrado para realizar compras.

Características del Proyecto

Navegación de Productos: Los usuarios pueden explorar y buscar productos disponibles en la tienda sin 
necesidad de autenticarse.

Autenticación y Autorización: Se utiliza Passport.js para la gestión de usuarios, que permite registro 
e inicio de sesión con seguridad.

Carrito de Compras: Los usuarios autenticados pueden agregar productos al carrito, visualizar el total 
y proceder con la compra.

Gestión de Sesiones:

Los usuarios autenticados tienen acceso a un menú donde pueden cerrar sesión.
Si no han iniciado sesión, se les solicitará autenticarse antes de realizar una compra.
Dashboard de Administración: El cliente tiene acceso a un panel de administración en la ruta /admin, 
desde donde puede gestionar los productos, usuarios y pedidos de la tienda en un solo lugar.

Productos: Añadir, editar o eliminar productos.
Usuarios: Control de usuarios registrados.
Pedidos: Visualización y gestión de los pedidos realizados por los usuarios.
Integración de Mock y Test: Uso de Faker.js para la generación de datos simulados en las pruebas, y 
tests automatizados utilizando las librerías adecuadas para asegurar la calidad del código.

Tecnologías Utilizadas

Backend:

Node.js con Express como framework principal.
Passport.js para la autenticación y autorización.
Uso de Handlebars para la generación de vistas del lado del servidor.
Integración de Swagger para la documentación de API.

Frontend:

HTML y CSS para el diseño de las vistas.
JavaScript para la interacción dinámica y validaciones.
Handlebars para la renderización dinámica de las páginas.
Base de Datos: MongoDB para la persistencia de datos.

Testing: Pruebas unitarias y de integración usando Mocha y Chai.

Estructura del Proyecto


YmirShop-main/
├── src/
│   ├── config/                  # Configuraciones (Passport, logger, Swagger)
│   ├── controllers/             # Controladores (productos, carritos, sesiones, etc.)
│   ├── dao/                     # DAO (acceso a datos)
│   ├── public/                  # Archivos estáticos (imágenes, CSS, JS)
│   ├── views/                   # Vistas (Handlebars)
│   ├── app.js                   # Archivo principal de la aplicación
├── test/                        # Tests
├── uploads/                     # Almacenamiento de archivos (documentos y fotos)
├── package.json                 # Dependencias del proyecto
├── .gitignore                   # Archivos ignorados por git

Instalación y Configuración

Clona el repositorio:

git clone https://github.com/EzequielOmarArraygada/YmirShop.git
Instala las dependencias:

npm install
Configura las variables de entorno en un archivo .env (ejemplo proporcionado en .env.example).

Inicia la aplicación:

npm start
Pruebas
Puedes ejecutar las pruebas unitarias e integrales con el siguiente comando:

npm test
Contribución
Si deseas contribuir a este proyecto, sigue los siguientes pasos:

Haz un fork del repositorio.
Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
Realiza los cambios necesarios y haz commit (git commit -m 'Agrega nueva funcionalidad').
Sube los cambios a tu repositorio (git push origin feature/nueva-funcionalidad).
Abre un Pull Request.

Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarme en tr.ezequiel@gmail.com o a través de mi https://www.linkedin.com/in/ezequiel-arraygada.

