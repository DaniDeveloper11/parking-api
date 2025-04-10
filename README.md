# 🚗 Parking API

API RESTful + GraphQL para gestión de estacionamientos con control de accesos por tipo de usuario.
tipos de usuarios: (corporate, provider, visitor)  
tipo de estacionamiento: (public, private, courtesy).
##

---

## 📦 Tecnologías

- Node.js + Express
- PostgreSQL + Sequelize ORM
- GraphQL con `express-graphql`
- Bcryptjs para encriptar contraseñas
- Morgan para visualizar request status
- JWT para autenticación
- Docker + Docker Compose
- Jest + Supertest para testing

---

## ⚙️ Instalación local

```bash
# Clona el repositorio
git clone https://github.com/tuusuario/parking-api.git
cd parking-api

# Instala dependencias
npm install

# Copia el archivo de entorno
cp .env.example .env

# Crea la base de datos
npx sequelize-cli db:create

# Corre migraciones y seeders
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# Inicia el servidor
npm run dev

🐳 Uso con Docker
ingresa el comando desde terminal:
docker-compose up --build


Levanta la base de datos PostgreSQL
levanta un contenedor con node y las dependencias del proyecto
Ejecuta el script entrypoint.sh que hace las migraciones y seeders

Inicia el servidor en http://localhost:3000

🔐 Variables de entorno
Crea un archivo .env basado en .env.example.

env
Copiar
Editar
DB_USER=postgres || 127.0.0.1
DB_PASSWORD=199811
DB_NAME=parking_db
DB_NAME_TEST=parking_test_db
DB_HOST=postgres
DB_PORT=5432

JWT_SECRET=parcojwtkey
🧪 Testing

# Correr pruebas una por una o con el comando test
npm run test

npx jest users.spec
npx jest checkin.visitor.spec
npx jest checkin.provider.spec
npx jest checkin.corporate.spec
npx jest auth.spec
npx jest graphql/parkings
npx jest graphql/allCheckIns

# Opcional: preparar base de test manualmente
npx sequelize-cli db:create --env test
npx sequelize-cli db:migrate --env test
npx sequelize-cli db:seed:all --env test
🔎 Endpoints REST
POST /api/users → Crear usuario

POST /api/users/login → Login y obtener token

GET /api/users → Obtener todos los usuarios (solo para pruebas)

POST /api/checkin → Check-in de usuario con validación por tipo

🧬 GraphQL
Disponible en:

POST http://localhost:3000/graphql
Ejemplos de queries:
graphql
Copiar
Editar
query {
  parkings {
    totalItems
    data {
      name
      parkingType
    }
  }
}
graphql
Copiar
Editar
query {
  allCheckIns {
    totalItems
    data {
      success
      createdAt
      user {
        email
        userType
      }
      parking {
        name
      }
    }
  }
}
🔑 Autenticación
Se utiliza JWT. Para endpoints protegidos (como /api/checkin o GraphQL privados), incluye el token:

Authorization: Bearer <tu_token_aquí>
✍️ Autor
Desarrollado por Angel Daniel Montes Villarreal 🚀

