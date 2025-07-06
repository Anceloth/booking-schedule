# Arquitectura Hexagonal - Clean Architecture

Esta aplicación sigue los principios de la Arquitectura Hexagonal (Clean Architecture), organizando el código en capas bien definidas con responsabilidades específicas.

## Estructura de Carpetas

```
src/
├── domain/                 # Capa de Dominio (Núcleo de la aplicación)
│   ├── entities/          # Entidades de dominio
│   ├── repositories/      # Interfaces de repositorios
│   └── services/          # Servicios de dominio
├── application/           # Capa de Aplicación (Casos de uso)
│   ├── use-cases/         # Casos de uso de la aplicación
│   ├── dtos/              # Data Transfer Objects
│   └── ports/             # Puertos (interfaces)
├── infrastructure/        # Capa de Infraestructura (Detalles técnicos)
│   ├── database/          # Configuración y acceso a base de datos
│   │   ├── repositories/  # Implementaciones de repositorios con Prisma
│   │   └── prisma.service.ts # Servicio de Prisma
│   └── config/            # Configuraciones
├── presentation/          # Capa de Presentación (API)
│   ├── controllers/       # Controladores REST
│   ├── guards/            # Guards de autenticación/autorización
│   ├── interceptors/      # Interceptores
│   └── filters/           # Filtros de excepción
└── shared/                # Código compartido
    ├── constants/         # Constantes globales
    ├── utils/             # Utilidades compartidas
    └── types/             # Tipos TypeScript compartidos
```

## Principios de la Arquitectura

### 1. Capa de Dominio (Domain)
- **Responsabilidad**: Contiene la lógica de negocio central
- **Dependencias**: No depende de ninguna otra capa
- **Contenido**: Entidades, interfaces de repositorios, servicios de dominio

### 2. Capa de Aplicación (Application)
- **Responsabilidad**: Orquesta los casos de uso
- **Dependencias**: Solo depende de la capa de dominio
- **Contenido**: Casos de uso, DTOs, puertos

### 3. Capa de Infraestructura (Infrastructure)
- **Responsabilidad**: Implementa los detalles técnicos
- **Dependencias**: Depende de dominio y aplicación
- **Contenido**: Repositorios, base de datos, configuraciones

### 4. Capa de Presentación (Presentation)
- **Responsabilidad**: Maneja la comunicación externa (API REST)
- **Dependencias**: Depende de aplicación
- **Contenido**: Controladores, guards, interceptores

### 5. Capa Compartida (Shared)
- **Responsabilidad**: Código reutilizable entre capas
- **Dependencias**: Puede ser usado por todas las capas
- **Contenido**: Constantes, utilidades, tipos

## Flujo de Dependencias

```
Presentation → Application → Domain
     ↓              ↓
Infrastructure ←────┘
```

## Beneficios

- **Testabilidad**: Fácil de testear cada capa de forma aislada
- **Mantenibilidad**: Código organizado y fácil de mantener
- **Escalabilidad**: Estructura que permite crecer sin perder control
- **Flexibilidad**: Fácil intercambio de implementaciones (bases de datos, APIs, etc.)
- **Separación de responsabilidades**: Cada capa tiene una responsabilidad específica
