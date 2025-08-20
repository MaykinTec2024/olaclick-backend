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