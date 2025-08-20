# 🧪 OlaClick Backend Challenge - NestJS Edition

Esta es mi solución al **OlaClick Backend Challenge**, que consiste en diseñar e implementar una API RESTful para gestionar órdenes de un restaurante utilizando:

- **Node.js + TypeScript**
- **NestJS** (arquitectura modular y principios SOLID)
- **Sequelize** (ORM)
- **PostgreSQL** como base de datos
- **Redis** para cache
- **Docker** para contenerización

---

## 🎯 Requerimientos Funcionales Implementados

✅ **Listar todas las órdenes**  
- `GET /orders`  
- Devuelve todas las órdenes con estado diferente de `delivered`.  
- Resultado cacheado en **Redis** por 30 segundos.  

✅ **Crear una nueva orden**  
- `POST /orders`  
- Inserta una nueva orden en estado **initiated**.  
- Ejemplo de request:
```json
{
  "clientName": "Ana López",
  "items": [
    { "description": "Ceviche", "quantity": 2, "unitPrice": 50 },
    { "description": "Chicha morada", "quantity": 1, "unitPrice": 10 }
  ]
}
```

✅ **Ver detalle de una orden**  
- `GET /orders/:id`  
- Muestra la orden con todos sus detalles e items.

✅ **Avanzar estado de una orden**  
- `POST /orders/:id/advance`  
- Flujo de estados: initiated → sent → delivered
- Cuando llega a delivered, se elimina de la base de datos y del caché.

# ⚙️ Instalación y Ejecución

**1. Clonar repositorio** 
- git clone https://github.com/MaykinTec2024/olaclick-backend.git
- cd olaclick-backend

**2. Configurar variables de entorno** 
- cp .env.example .env

**3. Levantar con Docker** 

- docker-compose up --build

## ✅ Testing

```bash
docker exec -it olaclick_api sh
npm run test:e2e
```

# ✅ Probar Endpoints en postman

**1. Crear una nueva orden** 

- POST http://localhost:3000/orders
```
{
  "clientName": "Maykin Iparraguirre",
  "items": [
    { "description": "Hamburguesa doble", "quantity": 1, "unitPrice": 8.5 },
    { "description": "Papas fritas", "quantity": 2, "unitPrice": 3.0 },
    { "description": "Coca-Cola lata", "quantity": 3, "unitPrice": 1.5 }
  ]
}
```
**2. Listar órdenes** 

- GET http://localhost:3000/orders

**3. Ver detalle de una orden** 

- GET http://localhost:3000/orders/:id

**1. Avanzar estado de una orden** 

- POST http://localhost:3000/orders/:id/advance

# ❓ Respuestas a preguntas adicionales

- ¿Cómo desacoplarías la lógica de negocio del framework NestJS?
  La lógica de negocio debería estar en servicios y casos de uso que no dependan de NestJS ni de librerías externas. Los controladores solo actúan como una capa de entrada/salida (HTTP, CLI, gRPC, etc.), mientras que el dominio se mantiene independiente. Esto permite cambiar de framework sin reescribir la lógica principal y facilita pruebas unitarias más simples.

- ¿Cómo escalarías esta API para soportar miles de órdenes concurrentes?
  Se puede escalar horizontalmente con múltiples instancias en contenedores Docker orquestados con Kubernetes o similares, detrás de un balanceador de carga. La aplicación debe ser stateless (sin depender de estado local). Para mejorar el rendimiento, se optimizan consultas SQL con índices, se cachean resultados en Redis, y para operaciones pesadas se utilizan colas de mensajes como RabbitMQ o Kafka, garantizando que la API pueda responder rápido incluso bajo alta demanda.
  
- ¿Qué ventajas ofrece Redis en este caso y qué alternativas considerarías?
  Redis es ideal porque guarda datos en memoria, lo que permite respuestas muy rápidas y reduce carga en la base de datos. Además, soporta estructuras como listas, sets y pub/sub que pueden extender la solución más adelante. Como alternativas consideraríamos Memcached (para un cache simple y ligero) o sistemas de cache distribuido como Hazelcast o Apache Ignite si se requiere alta disponibilidad y replicación en entornos distribuidos.
