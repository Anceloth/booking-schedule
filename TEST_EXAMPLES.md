# Ejemplos de Pruebas para la API

Este documento contiene ejemplos prácticos para probar la API de reservas con integración OAuth 2.0.

## 🔧 Configuración Previa

1. Asegúrate de que la base de datos esté funcionando:
   ```bash
   docker compose up -d
   ```

2. Ejecuta las migraciones y seeders:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

3. Configura las variables de entorno para Google OAuth:
   ```bash
   cp .env.example .env
   # Edita .env con tus credenciales de Google OAuth 2.0
   ```

4. Inicia el servidor:
   ```bash
   npm run start:dev
   ```

## 🔐 Flujo de Autenticación OAuth 2.0

### 1. Iniciar Autorización con Google
```bash
curl -X GET http://localhost:3001/auth/google
```
Esto te redirigirá a Google para autorizar el acceso a tu calendario.

### 2. Verificar Estado de Autenticación
```bash
curl -X GET http://localhost:3001/auth/status
```

### 3. Probar Conexión con Google Calendar
```bash
curl -X GET http://localhost:3001/bookings/test-calendar
```

## 📋 Usuarios de Prueba

Los siguientes usuarios están disponibles para las pruebas (creados por el seeder):

- **Juan Pérez** (ID: `f2b8894c-74bd-4052-a85a-5420e9688f2c`)
  - Email: juan.perez@example.com
  - Organizer de reuniones

- **María García** (ID: `54637498-f140-41a8-a412-32ca2e1231e5`)
  - Email: maria.garcia@example.com
  - Project Manager

- **Carlos López** (ID: `3e622a0c-cc22-4165-8f73-536433fe30a8`)
  - Email: carlos.lopez@example.com
  - Developer

- **Ana Martínez** (ID: `63a928fb-d69c-4925-9985-27a5fbdbd2e4`)
  - Email: ana.martinez@example.com
  - Designer

## 🧪 Ejemplos de Pruebas

### 1. Crear una Reunión Simple

```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Daily Standup",
    "description": "Reunión diaria del equipo",
    "startDate": "2025-07-08T09:00:00.000Z",
    "endDate": "2025-07-08T09:30:00.000Z",
    "organizerId": "f2b8894c-74bd-4052-a85a-5420e9688f2c",
    "participants": ["54637498-f140-41a8-a412-32ca2e1231e5"]
  }'
```

### 2. Reunión de Todo el Equipo

```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sprint Planning",
    "description": "Planificación del Sprint 15",
    "startDate": "2025-07-10T14:00:00.000Z",
    "endDate": "2025-07-10T16:00:00.000Z",
    "organizerId": "54637498-f140-41a8-a412-32ca2e1231e5",
    "participants": [
      "f2b8894c-74bd-4052-a85a-5420e9688f2c",
      "3e622a0c-cc22-4165-8f73-536433fe30a8",
      "63a928fb-d69c-4925-9985-27a5fbdbd2e4"
    ]
  }'
```

### 3. Bloque de Tiempo Individual

```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Focus Time",
    "description": "Tiempo dedicado a desarrollo sin interrupciones",
    "startDate": "2025-07-09T08:00:00.000Z",
    "endDate": "2025-07-09T12:00:00.000Z",
    "organizerId": "3e622a0c-cc22-4165-8f73-536433fe30a8",
    "participants": []
  }'
```

### 4. Consultar Todas las Reservas

```bash
curl -X GET http://localhost:3001/bookings
```

### 5. Consultar Reserva por ID

```bash
curl -X GET http://localhost:3001/bookings/{booking-id}
```

### 6. Actualizar una Reserva

```bash
curl -X PUT http://localhost:3001/bookings/{booking-id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sprint Planning - Actualizado",
    "description": "Planificación del Sprint 15 con agenda extendida",
    "startDate": "2025-07-10T14:00:00.000Z",
    "endDate": "2025-07-10T17:00:00.000Z",
    "participants": [
      "f2b8894c-74bd-4052-a85a-5420e9688f2c",
      "3e622a0c-cc22-4165-8f73-536433fe30a8"
    ]
  }'
```

### 7. Cancelar una Reserva

```bash
curl -X PATCH http://localhost:3001/bookings/{booking-id}/cancel
```

## 🔍 Verificaciones

### Comprobar Estado de la Base de Datos

```bash
# Conectarse a la BD para verificar datos
docker exec -it booking-schedule-postgres psql -U postgres -d booking_schedule
```

### Consultas SQL Útiles

```sql
-- Ver todos los usuarios
SELECT * FROM "User";

-- Ver usuarios con tokens OAuth
SELECT id, name, email, "accessToken" IS NOT NULL as has_token FROM "User";

-- Ver todas las reservas
SELECT * FROM "Booking";

-- Ver reservas con organizador
SELECT b.*, u.name as organizer_name 
FROM "Booking" b 
JOIN "User" u ON b."organizerId" = u.id;

-- Ver participantes de una reserva
SELECT b.title, u.name as participant_name
FROM "Booking" b
JOIN "_BookingParticipants" bp ON b.id = bp."A"
JOIN "User" u ON bp."B" = u.id;
```

## 📈 Casos de Prueba Avanzados

### Test de Conflictos de Horarios con Google Calendar

1. Primero autoriza el acceso a Google Calendar:
```bash
curl -X GET http://localhost:3001/auth/google
```

2. Crear una reserva:
```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Reunión A",
    "startDate": "2025-07-08T10:00:00.000Z",
    "endDate": "2025-07-08T11:00:00.000Z",
    "organizerId": "f2b8894c-74bd-4052-a85a-5420e9688f2c",
    "participants": ["54637498-f140-41a8-a412-32ca2e1231e5"]
  }'
```

3. Intentar crear una reserva conflictiva:
```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Reunión B",
    "startDate": "2025-07-08T10:30:00.000Z",
    "endDate": "2025-07-08T11:30:00.000Z",
    "organizerId": "f2b8894c-74bd-4052-a85a-5420e9688f2c",
    "participants": ["54637498-f140-41a8-a412-32ca2e1231e5"]
  }'
```

Esto verificará conflictos tanto en la base de datos como en Google Calendar.

### Test de Integración OAuth

1. **Verificar conexión inicial:**
```bash
curl -X GET http://localhost:3001/auth/status
# Debería devolver: {"authenticated": false}
```

2. **Autorizar acceso:**
```bash
curl -X GET http://localhost:3001/auth/google
# Te redirige a Google para autorización
```

3. **Verificar después de autorización:**
```bash
curl -X GET http://localhost:3001/auth/status
# Debería devolver: {"authenticated": true, "user": {...}}
```

4. **Probar conexión a calendar:**
```bash
curl -X GET http://localhost:3001/bookings/test-calendar
# Debería devolver eventos del calendario
```

## 🚀 Testing con Postman/Insomnia

Importa las colecciones desde:
- `collections/postman-collection.json`
- `collections/insomnia-collection.json`

Estas colecciones incluyen:
- ✅ Endpoints OAuth 2.0 (`/auth/google`, `/auth/status`)
- ✅ Test de conexión Google Calendar (`/bookings/test-calendar`)
- ✅ Todos los endpoints de gestión de reservas
- ✅ Variables de entorno configuradas

## 📝 Notas Importantes

- **OAuth 2.0**: Cada usuario debe autorizar el acceso a su Google Calendar
- **Tokens**: Los tokens OAuth se almacenan en la base de datos por usuario
- **Conflictos**: La verificación ahora incluye Google Calendar además de la BD
- Los IDs de usuarios están hardcodeados basándose en el seeder
- Los timestamps están en formato ISO 8601 con timezone UTC
- El puerto por defecto es 3001
- Todas las fechas deben estar en el futuro para evitar errores de validación

## 🔧 Troubleshooting

### Error: "Google OAuth not configured"
- Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` estén configurados
- Asegúrate de que `GOOGLE_CALLBACK_URL` sea correcta

### Error: "User not authenticated"
- Ejecuta primero el flujo OAuth: `GET /auth/google`
- Verifica el estado con: `GET /auth/status`

### Error: "Calendar access denied"
- Revoca y vuelve a autorizar el acceso en Google
- Verifica los scopes de Google Calendar en la configuración
