# Booking Schedule - NestJS con Arquitectura Hexagonal

## Descripción

Booking Schedule es una aplicación NestJS que implementa una arquitectura hexagonal (Clean Architecture) para la gestión de reservas. La aplicación está integrada con PostgreSQL usando Prisma ORM y sigue los principios de separación de responsabilidades.

## Arquitectura Hexagonal

La aplicación está estructurada en las siguientes capas:

```
src/
├── domain/                 # Capa de Dominio (Núcleo)
│   ├── entities/          # Entidades de dominio
│   ├── repositories/      # Interfaces de repositorios
│   └── services/          # Servicios de dominio
├── application/           # Capa de Aplicación (Casos de uso)
│   ├── use-cases/         # Casos de uso
│   ├── dtos/              # Data Transfer Objects
│   └── ports/             # Puertos (interfaces)
├── infrastructure/        # Capa de Infraestructura
│   ├── database/          # Configuración de base de datos
│   │   ├── repositories/  # Implementaciones de repositorios con Prisma
│   │   └── prisma.service.ts # Servicio de Prisma
│   └── config/            # Configuraciones
├── presentation/          # Capa de Presentación
│   ├── controllers/       # Controladores REST
│   ├── guards/            # Guards
│   ├── interceptors/      # Interceptores
│   └── filters/           # Filtros
└── shared/                # Código compartido
    ├── constants/         # Constantes
    ├── utils/             # Utilidades
    └── types/             # Tipos TypeScript

collections/               # Colecciones de API para testing
├── postman-collection.json
├── insomnia-collection.json
└── API-Testing-Guide.md
```

## Tecnologías Utilizadas

- **NestJS**: Framework para Node.js
- **Prisma**: ORM moderno para TypeScript y Node.js
- **PostgreSQL**: Base de datos relacional
- **Class-validator**: Validación de DTOs
- **Class-transformer**: Transformación de datos
- **UUID**: Generación de identificadores únicos
- **Docker**: Contenedores para base de datos

## Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- Docker y Docker Compose
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd booking-schedule
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

4. Levanta la base de datos con Docker:
```bash
docker compose up -d
```

5. Ejecuta las migraciones y seeders:
```bash
npm run db:migrate
```

## Ejecución

### Desarrollo
```bash
npm run start:dev
```
La aplicación estará disponible en http://localhost:3001

### Producción
```bash
npm run build
npm run start:prod
```

## Datos de Prueba

El proyecto incluye un sistema de seeders que popula la base de datos con datos de prueba:

### Usuarios de Prueba
- John Doe (john.doe@example.com)
- Jane Smith (jane.smith@example.com)
- Admin User (admin@example.com)
- Developer User (developer@example.com)

### Bookings de Ejemplo
- "Team Stand-up Meeting" - Programado para mañana
- "Project Planning Session" - Programado para la próxima semana

### Comandos de Base de Datos
```bash
# Ejecutar seeders manualmente
npm run db:seed

# Migrar base de datos
npm run db:migrate

# Resetear base de datos y ejecutar seeders
npx prisma migrate reset --force

# Abrir Prisma Studio (interfaz gráfica)
npm run db:studio
```

## API Endpoints

### Reservas

- `POST /bookings` - Crear una reserva
- `GET /bookings` - Obtener todas las reservas
- `GET /bookings/:id` - Obtener una reserva por ID
- `PUT /bookings/:id` - Actualizar una reserva

### Ejemplo de Payload para Crear Reserva

```json
{
  "title": "Reserva de Sala",
  "description": "Reserva para reunión del equipo",
  "startDate": "2025-07-15T09:00:00.000Z",
  "endDate": "2025-07-15T10:00:00.000Z",
  "organizerId": "uuid-del-organizador",
  "participants": ["uuid-participante-1", "uuid-participante-2"]
}
```

### Ejemplo de Respuesta

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Reserva de Sala",
  "description": "Reserva para reunión del equipo",
  "startDate": "2025-07-15T09:00:00.000Z",
  "endDate": "2025-07-15T10:00:00.000Z",
  "organizerId": "uuid-del-organizador",
  "participants": ["uuid-participante-1", "uuid-participante-2"],
  "createdAt": "2025-07-06T12:00:00.000Z",
  "updatedAt": "2025-07-06T12:00:00.000Z"
}
```

## Testing de API

El proyecto incluye colecciones preconfiguradas para probar la API:

### Archivos de Colecciones
- **collections/postman-collection.json** - Colección para Postman
- **collections/insomnia-collection.json** - Colección para Insomnia
- **collections/API-Testing-Guide.md** - Guía detallada de uso

### Importar en Postman
1. Abre Postman
2. Haz clic en "Import"
3. Selecciona `collections/postman-collection.json`

### Importar en Insomnia
1. Abre Insomnia
2. Ve a "Application" > "Preferences" > "Data" > "Import Data"
3. Selecciona `collections/insomnia-collection.json`

### Endpoints Incluidos
- Crear/Obtener/Actualizar Bookings
- Ejemplos con usuarios de prueba
- Variables preconfiguradas

Consulta `collections/API-Testing-Guide.md` para instrucciones detalladas.

## Servicios Disponibles

### Base de Datos
- **PostgreSQL**: Puerto 5432
- **Adminer**: http://localhost:8080 (Interfaz web para administrar la BD)

### Aplicación
- **API REST**: http://localhost:3001
- **Prisma Studio**: `npm run db:studio` (Interfaz gráfica para datos)

### Herramientas de Desarrollo
- **ESLint**: Linting automático
- **Prettier**: Formateo de código
- **TypeScript**: Tipado estático
- **Jest**: Testing framework

## Principios de Arquitectura

### 1. Independencia de Frameworks
- La lógica de negocio no depende de frameworks específicos
- Fácil intercambio de tecnologías

### 2. Testabilidad
- Cada capa puede ser probada de forma independiente
- Mocks y stubs para las dependencias

### 3. Independencia de Base de Datos
- La lógica de negocio no está acoplada a la base de datos
- Fácil cambio de proveedor de base de datos

### 4. Separación de Responsabilidades
- Cada capa tiene una responsabilidad específica
- Bajo acoplamiento, alta cohesión

## Desarrollo

### Estructura de Archivos

- **Entidades de Dominio**: Representan conceptos del negocio
- **Repositorios**: Abstracciones para acceso a datos
- **Casos de Uso**: Lógica de aplicación específica
- **Controladores**: Puntos de entrada de la API
- **DTOs**: Objetos de transferencia de datos

### Flujo de Datos

```
Request → Controller → Use Case → Repository → Database
Response ← Controller ← Use Case ← Repository ← Database
```

### Comandos Útiles

```bash
# Base de datos
npm run db:migrate      # Ejecutar migraciones
npm run db:generate     # Generar cliente Prisma
npm run db:push         # Empujar schema a BD
npm run db:seed         # Ejecutar seeders
npm run db:studio       # Abrir Prisma Studio

# Desarrollo
npm run start:dev       # Iniciar en modo desarrollo
npm run build           # Compilar proyecto
npm run format          # Formatear código
npm run lint            # Ejecutar linter
npm run test            # Ejecutar tests
npm run test:e2e        # Ejecutar tests e2e

# Docker
docker compose up -d    # Levantar servicios
docker compose down     # Detener servicios
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
