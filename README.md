## Description

This is an E-commerce Backend API built with [Nest](https://github.com/nestjs/nest) framework using Hexagonal Architecture (also known as Ports and Adapters pattern). This project demonstrates clean architecture principles with a clear separation of concerns.

## Author

- [Huu Loc](https://github.com/huuloc2026)

### Architecture Overview

The application follows hexagonal architecture with three main layers:

- **Domain Layer**: Contains business logic, entities, and domain services
- **Application Layer**: Contains use cases and ports (interfaces)
- **Infrastructure Layer**: Contains adapters and implementations of ports

### Key Features

- 🛍️ Product management
- 👥 User management and authentication
- 🛒 Shopping cart operations
- 📦 Order processing
- 💳 Payment integration
- 📊 Inventory management
- 🔐 Role-based access control

### Tech Stack

- NestJS
- TypeScript
- PostgreSQL
- Redis
- BullMQ
- Prisma
- JWT Authentication
- Stripe
- OpenAPI (Swagger)
- Jest for testing

## Project Structure

```
src/
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── auth
│   ├── application
│   │   ├── dtos
│   │   │   ├── change-password.dto.ts
│   │   │   ├── index.ts
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   └── services
│   │       └── auth.service.ts
│   ├── auth.module.ts
│   ├── domain
│   │   ├── entities
│   │   │   └── auth.entity.ts
│   │   └── ports
│   │       └── auth.repository.port.ts
│   ├── infrastructure
│   │   └── adapters
│   │       └── auth.repository.adapter.ts
│   └── interface
│       ├── controllers
│       │   └── auth.controller.ts
│       ├── decorators
│       │   ├── get-refresh-token.decorator.ts
│       │   ├── get-user.decorator.ts
│       │   └── is-public.decorator.ts
│       ├── guards
│       │   ├── at.guard.ts
│       │   ├── refresh-token.guard.ts
│       │   ├── rt.guard.ts
│       │   └── token-blacklist.guard.ts
│       └── strategies
│           ├── at.strategy.ts
│           └── rt.strategy.ts
├── infrastructure
│   └── prisma
│       ├── prisma.module.ts
│       └── prisma.service.ts
├── main.ts
├── module
│   ├── auth
│   │   ├── application
│   │   │   ├── dtos
│   │   │   └── services
│   │   ├── domain
│   │   │   ├── entities
│   │   │   └── ports
│   │   ├── infrastructure
│   │   │   └── adapters
│   │   └── interface
│   │       ├── controllers
│   │       ├── decorators
│   │       ├── guards
│   │       └── strategies
│   ├── carts
│   │   ├── application
│   │   │   ├── dtos
│   │   │   │   ├── add-cart-item.dto.ts
│   │   │   │   └── update-cart-item.dto.ts
│   │   │   └── services
│   │   │       └── cart.service.ts
│   │   ├── carts.module.ts
│   │   ├── domain
│   │   │   ├── entities
│   │   │   │   ├── cart.entity.ts
│   │   │   │   └── cart-item.entity.ts
│   │   │   └── ports
│   │   │       └── cart.repository.port.ts
│   │   ├── infrastructure
│   │   │   └── adapters
│   │   │       └── cart.repository.adapter.ts
│   │   └── interface
│   │       └── carts.controller.ts
│   ├── orders
│   │   ├── application
│   │   │   ├── dtos
│   │   │   │   ├── create-order.dto.ts
│   │   │   │   └── create-order-item.dto.ts
│   │   │   └── services
│   │   │       └── order.service.ts
│   │   ├── domain
│   │   │   ├── entities
│   │   │   │   ├── order.entity.ts
│   │   │   │   └── order-item.entity.ts
│   │   │   └── ports
│   │   │       └── order.repository.port.ts
│   │   ├── infrastructure
│   │   │   └── adapters
│   │   │       └── order.repository.adapter.ts
│   │   └── orders.module.ts
│   ├── products
│   │   ├── application
│   │   │   ├── dtos
│   │   │   │   ├── baseProductParam.dto.ts
│   │   │   │   ├── create-product.dto.ts
│   │   │   │   └── update-product.dto.ts
│   │   │   └── services
│   │   │       └── product.service.ts
│   │   ├── domain
│   │   │   ├── entities
│   │   │   │   └── product.entity.ts
│   │   │   └── ports
│   │   │       └── product.repository.port.ts
│   │   ├── infrastructure
│   │   │   └── adapters
│   │   │       └── product.repository.adapter.ts
│   │   ├── interface
│   │   │   └── controllers
│   │   │       └── product.controller.ts
│   │   └── products.module.ts
│   └── users
│       ├── application
│       │   ├── dtos
│       │   │   ├── create-user.dto.ts
│       │   │   └── update-user.dto.ts
│       │   └── services
│       │       └── user.service.ts
│       ├── domain
│       │   ├── entities
│       │   │   └── user.entity.ts
│       │   └── ports
│       │       └── user.repository.port.ts
│       ├── infrastructure
│       │   └── adapters
│       │       └── user.repository.adapter.ts
│       ├── interface
│       │   └── controllers
│       │       └── user.controller.ts
│       ├── __tests__
│       │   └── user.service.spec.ts
│       └── users.module.ts
└── shared
    ├── interceptors
    │   ├── error.interceptor.ts
    │   ├── logging.interceptor.ts
    │   └── transform.interceptor.ts
    ├── interface
    │   ├── BaseRepository.interface.ts
    │   └── PaginatedResult.ts
    ├── redis
    │   ├── redis.module.ts
    │   └── redis.service.ts
    ├── services
    │   └── crypto.service.ts
    └── shared.module.ts
```
