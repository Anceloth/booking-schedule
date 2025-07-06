# Colecciones de API para Testing

Este directorio contiene colecciones preconfiguradas para probar la API de Booking Schedule usando Postman e Insomnia.

## 📋 Contenido

- **postman-collection.json** - Colección para Postman
- **insomnia-collection.json** - Colección para Insomnia  
- **API-Testing-Guide.md** - Esta guía de uso

## 🚀 Configuración Rápida

### Para Postman

1. Abre Postman
2. Haz clic en "Import" 
3. Selecciona el archivo `postman-collection.json`
4. La colección se importará con todas las requests preconfiguradas

### Para Insomnia

1. Abre Insomnia
2. Ve a "Application" > "Preferences" > "Data" > "Import Data"
3. Selecciona el archivo `insomnia-collection.json`
4. La colección se importará con todas las requests preconfiguradas

## 🔧 Variables de Entorno

Ambas colecciones incluyen las siguientes variables:

- **baseUrl**: `http://localhost:3001` (URL base de la API)
- **bookingId**: ID de ejemplo para operaciones que requieren un ID específico

## 📝 Endpoints Incluidos

### 1. Health Check
- **GET** `/` - Verifica que la API esté funcionando

### 2. Crear Booking (Básico)
- **POST** `/bookings` - Crea una reserva básica con algunos participantes
- Usa UUIDs de los usuarios creados por los seeders

### 3. Obtener Todas las Reservas
- **GET** `/bookings` - Obtiene todas las reservas existentes

### 4. Obtener Reserva por ID
- **GET** `/bookings/:id` - Obtiene una reserva específica
- Usa la variable `{{bookingId}}` que puedes actualizar

### 5. Actualizar Reserva
- **PUT** `/bookings/:id` - Actualiza una reserva existente
- Ejemplo con cambios en título, descripción, horario y participantes

### 6. Crear Booking - Ejemplo Completo
- **POST** `/bookings` - Ejemplo completo con todos los usuarios de prueba
- Incluye todos los UUIDs de usuarios creados por los seeders

### 7. Crear Booking - Solo Organizador
- **POST** `/bookings` - Ejemplo de booking sin participantes
- Útil para probar reservas individuales

## 👥 Usuarios de Prueba (Seeders)

Los siguientes UUIDs están preconfigurados en las colecciones y corresponden a los usuarios creados por los seeders:

```
John Doe: f2b8894c-74bd-4052-a85a-5420e9688f2c
Jane Smith: 54637498-f140-41a8-a412-32ca2e1231e5  
Admin User: 3e622a0c-cc22-4165-8f73-536433fe30a8
Developer User: 63a928fb-d69c-4925-9985-27a5fbdbd2e4
```

> **Nota**: Estos UUIDs pueden cambiar si reseteas la base de datos. Para obtener los UUIDs actuales, usa el endpoint "Obtener Todas las Reservas" y copia los IDs de los usuarios desde las respuestas.

## 🔄 Flujo de Pruebas Recomendado

1. **Health Check** - Verifica que la API esté funcionando
2. **Obtener Todas las Reservas** - Ve los bookings existentes (creados por seeders)
3. **Crear Booking** - Crea una nueva reserva
4. **Obtener Reserva por ID** - Verifica la reserva creada (actualiza `bookingId` con el ID real)
5. **Actualizar Reserva** - Modifica la reserva
6. **Obtener Todas las Reservas** - Confirma los cambios

## 📊 Respuestas Esperadas

### Booking Response
```json
{
  "id": "uuid-generado",
  "title": "Título de la reserva",
  "description": "Descripción de la reserva",
  "startDate": "2025-07-08T09:00:00.000Z",
  "endDate": "2025-07-08T10:00:00.000Z",
  "organizerId": "uuid-del-organizador",
  "participants": ["uuid-participante-1", "uuid-participante-2"],
  "createdAt": "2025-07-06T12:00:00.000Z",
  "updatedAt": "2025-07-06T12:00:00.000Z"
}
```

### Error Response
```json
{
  "message": "Error message",
  "error": "Error type",
  "statusCode": 400
}
```

## 🛠️ Consejos de Uso

1. **Actualiza el bookingId**: Después de crear un booking, copia su ID y actualiza la variable `bookingId` en tu cliente
2. **Verifica fechas**: Los ejemplos usan fechas futuras, ajústalas según necesites
3. **Usuarios válidos**: Usa solo UUIDs de usuarios que existen en tu base de datos
4. **Formato de fechas**: Usa formato ISO 8601 para las fechas (YYYY-MM-DDTHH:mm:ss.sssZ)

## 🔍 Troubleshooting

### Error 404 en todos los endpoints
- Verifica que la aplicación esté corriendo en el puerto 3001
- Ejecuta `npm run start:dev` en el directorio del proyecto

### Error 500 al crear booking
- Verifica que la base de datos esté corriendo (`docker compose up -d`)
- Verifica que los UUIDs de organizador y participantes existan en la base de datos

### Error 400 "User not found"
- Ejecuta `npm run db:seed` para crear usuarios de prueba
- O usa UUIDs de usuarios existentes en tu base de datos

## 📱 Extensiones Recomendadas

### Para Postman
- Activa "Auto-sync" para mantener la colección actualizada
- Usa "Tests" tab para agregar validaciones automáticas

### Para Insomnia
- Instala plugins como "Response Timeline" para mejor debugging
- Usa "Environment" para cambiar fácilmente entre desarrollo/producción
