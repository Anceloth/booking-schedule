# API Collections

Este directorio contiene las colecciones de API preconfiguradas para testing.

## 📁 Estructura

```
collections/
├── postman-collection.json      # Colección para Postman
├── insomnia-collection.json     # Colección para Insomnia
├── API-Testing-Guide.md         # Guía completa de uso
└── README.md                    # Este archivo
```

## 🚀 Uso Rápido

### Postman
```bash
# Importar colección en Postman
1. Abre Postman
2. Import -> collections/postman-collection.json
```

### Insomnia
```bash
# Importar colección en Insomnia
1. Abre Insomnia
2. Import Data -> collections/insomnia-collection.json
```

## 📚 Documentación

Para instrucciones detalladas, consulta:
- [API-Testing-Guide.md](./API-Testing-Guide.md) - Guía completa de testing

## 🔧 Variables Preconfiguradas

- **baseUrl**: `http://localhost:3001`
- **bookingId**: ID de ejemplo para operaciones específicas

## 📝 Endpoints Incluidos

- CRUD completo de Bookings
- Ejemplos con usuarios de prueba (seeders)
- Variables de entorno preconfiguradas

## 🎯 Usuarios de Prueba

Los UUIDs de usuarios están preconfigurados en las colecciones:
- John Doe
- Jane Smith  
- Admin User
- Developer User

Consulta la guía completa para detalles sobre cómo usar estos usuarios en las pruebas.
