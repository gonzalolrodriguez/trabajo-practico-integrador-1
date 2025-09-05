# Documentación Proyecto: Trabajo Práctico Integrador 1

## Descripción General

Este proyecto es una API RESTful desarrollada en Node.js con Express, orientada a la gestión de usuarios, artículos, etiquetas y perfiles. Utiliza Sequelize para la conexión y manipulación de la base de datos relacional.

## Estructura del Proyecto

```
app.js
package.json
README.md
.env.example
src/
  config/
    database.js
  controllers/
    article_tags.controllers.js
    articles.controllers.js
    auth.controllers.js
    profiles.controllers.js
    tags.controllers.js
    users.controllers.js
  helpers/
    bcrypt.js
    jwt.js
  middlewares/
    admin.js
    auth.js
    owner.js
    validate.js
  models/
    article_tags.models.js
    articles.models.js
    profile.models.js
    tags.models.js
    users.models.js
  routes/
    article_tags.routes.js
    articles.routes.js
    auth.routes.js
    profiles.routes.js
    tags.routes.js
    users.routes.js
```

## Instalación y Configuración

1. **Clona el repositorio**
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo .env basado en .env.example y completa los datos de tu base de datos y JWT:

   ```
   DB_HOST=localhost
   DB_USER=usuario
   DB_PASSWORD=contraseña
   DB_NAME=nombre_db
   DB_DIALECT=mysql
   DB_PORT=3306
   PORT=6000
   JWT_SECRET=tu_clave_secreta
   ```

4. Inicia el servidor:
   ```bash
   npm run dev
   ```

## Estructura y Explicación de Carpetas

- **config/**: Configuración de la base de datos con Sequelize.
- **controllers/**: Lógica de negocio para cada entidad (usuarios, artículos, etc).
- **helpers/**: Funciones auxiliares (hash de contraseñas, generación de JWT).
- **middlewares/**: Validaciones, autenticación, autorización.
- **models/**: Definición de modelos Sequelize.
- **routes/**: Definición de endpoints y vinculación con controladores.

## Principales Endpoints

Todos los endpoints están bajo el prefijo `/api`.

### Autenticación

- `POST /api/auth/register`: Registro de usuario
- `POST /api/auth/login`: Login de usuario
- `POST /api/auth/logout`: Logout

### Usuarios

- `GET /api/users`: Listar usuarios (admin)
- `GET /api/users/:id`: Obtener usuario por ID
- `PUT /api/users/:id`: Actualizar usuario
- `DELETE /api/users/:id`: Eliminar usuario

### Artículos

- `POST /api/articles`: Crear artículo
- `GET /api/articles`: Listar artículos
- `GET /api/articles/:id`: Obtener artículo por ID
- `PUT /api/articles/:id`: Actualizar artículo
- `DELETE /api/articles/:id`: Eliminar artículo

### Etiquetas

- `POST /api/tags`: Crear etiqueta
- `GET /api/tags`: Listar etiquetas
- `GET /api/tags/:id`: Obtener etiqueta por ID
- `PUT /api/tags/:id`: Actualizar etiqueta
- `DELETE /api/tags/:id`: Eliminar etiqueta

### Perfiles

- `GET /api/profiles/:id`: Obtener perfil de usuario
- `PUT /api/profiles/:id`: Actualizar perfil

### Artículo-Etiqueta

- `POST /api/article-tags`: Asociar etiqueta a artículo
- `DELETE /api/article-tags/:id`: Eliminar asociación

## Ejemplo de Registro de Usuario

```json
POST /api/auth/register
{
  "username": "usuario1",
  "email": "usuario1@mail.com",
  "password": "123456",
  "first_name": "Juan",
  "last_name": "Pérez"
}
```

## Ejemplo de Respuesta Exitosa

```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "username": "usuario1",
    "email": "usuario1@mail.com",
    "role": "user"
  }
}
```

## Middlewares

- **auth.js**: Verifica JWT y autenticación.
- **admin.js**: Permite acceso solo a administradores.
- **owner.js**: Permite acceso solo al propietario del recurso.
- **validate.js**: Validaciones de datos y recursos.

## Modelos Principales

- **User**: username, email, password, role
- **Profile**: first_name, last_name, user_id
- **Article**: title, content, excerpt, status, user_id
- **Tag**: name
- **ArticleTag**: article_id, tag_id
