# Guía de Pruebas - OAuth 2.0 con Google Calendar

## 🚀 Configuración Rápida

### 1. Configurar Google Cloud (5 minutos)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo: `meet-schedule-test`
3. Habilita **Google Calendar API**:
   - APIs & Services → Library → "Google Calendar API" → Enable
4. Configura **OAuth consent screen**:
   - APIs & Services → OAuth consent screen
   - User Type: **External**
   - App name: `Meet Schedule`
   - User support email: tu email
   - Scopes: Add `../auth/calendar.readonly`
5. Crea **OAuth 2.0 Client ID**:
   - APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: **Web application**
   - Name: `Meet Schedule Web`
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
6. **Copia Client ID y Client Secret**

### 2. Configurar tu aplicación

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus credenciales
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### 3. Ejecutar la migración (cuando tengas DB activa)

```bash
npx prisma migrate dev --name add_google_oauth_tokens
```

## 🧪 Pruebas Paso a Paso

### Paso 1: Verificar configuración

```bash
# Inicia el servidor
npm run start:dev

# Verifica que está corriendo
curl http://localhost:3000/auth/status
```

**Respuesta esperada:**
```json
{
  "isAuthenticated": false,
  "user": null,
  "message": "Google Calendar not connected. Visit /auth/google to authorize."
}
```

### Paso 2: Autorizar Google Calendar

1. **Ve a:** `http://localhost:3000/auth/google`
2. **Serás redirigido a Google** para autorizar
3. **Autoriza el acceso** a tu Google Calendar
4. **Serás redirigido de vuelta** con una confirmación

**Respuesta esperada:**
```json
{
  "message": "Google Calendar connected successfully!",
  "user": "dev@example.com",
  "hasTokens": true
}
```

### Paso 3: Verificar conexión

```bash
curl http://localhost:3000/auth/status
```

**Respuesta esperada:**
```json
{
  "isAuthenticated": true,
  "user": "dev@example.com",
  "message": "Google Calendar is connected"
}
```

### Paso 4: Probar endpoint de prueba

```bash
curl http://localhost:3000/bookings/test-calendar
```

**Respuesta esperada:**
```json
{
  "message": "Conexión exitosa con Google Calendar",
  "events": [
    {
      "title": "Evento de prueba",
      "start": "2025-07-07T10:00:00.000Z",
      "end": "2025-07-07T11:00:00.000Z"
    }
  ]
}
```

## 🎯 Pruebas de Conflictos

### Paso 1: Crear evento en Google Calendar

1. Ve a [Google Calendar](https://calendar.google.com/)
2. Crea un evento para **mañana de 10:00 AM a 11:00 AM**
3. Anota las fechas exactas

### Paso 2: Crear usuarios de prueba

```bash
# Crear usuario organizador
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Organizer",
    "email": "organizer@example.com"
  }'

# Crear usuario participante
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Participant",
    "email": "participant@example.com"
  }'
```

### Paso 3: Probar creación de reserva SIN conflicto

```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Reunión sin conflicto",
    "description": "Esta reunión no debería tener conflictos",
    "startDate": "2025-07-07T14:00:00.000Z",
    "endDate": "2025-07-07T15:00:00.000Z",
    "organizerId": "organizer-id-aqui",
    "participants": ["participant-id-aqui"]
  }'
```

**Respuesta esperada:** HTTP 201 (Created)

### Paso 4: Probar creación de reserva CON conflicto

```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Reunión con conflicto",
    "description": "Esta reunión debería detectar conflictos",
    "startDate": "2025-07-07T10:00:00.000Z",
    "endDate": "2025-07-07T11:00:00.000Z",
    "organizerId": "organizer-id-aqui",
    "participants": ["participant-id-aqui"]
  }'
```

**Respuesta esperada:** HTTP 409 (Conflict)
```json
{
  "statusCode": 409,
  "message": "Conflicto de calendario detectado para dev@example.com..."
}
```

## 🔧 Troubleshooting

### Error: "OAuth client not found"
- Verifica que GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET estén configurados
- Verifica que no tengan espacios extra o caracteres especiales

### Error: "Redirect URI mismatch"
- Verifica que el callback URL en Google Cloud sea exactamente: `http://localhost:3000/auth/google/callback`
- No debe tener espacios o caracteres extra

### Error: "Scope not authorized"
- Ve a Google Cloud Console → OAuth consent screen
- Asegúrate de que el scope `../auth/calendar.readonly` esté agregado

### Error: "User not found"
- Asegúrate de que la base de datos esté corriendo
- Ejecuta la migración: `npx prisma migrate dev`

## 📝 Próximos Pasos

Una vez que las pruebas básicas funcionen:

1. **Asociar tokens con usuarios reales** (no solo el usuario de desarrollo)
2. **Implementar renovación automática de tokens**
3. **Agregar manejo de errores más robusto**
4. **Implementar logout/revocación de tokens**

¿Necesitas ayuda con algún paso específico?
