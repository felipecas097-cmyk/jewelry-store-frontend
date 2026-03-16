# 💎 GOLD by Descaleinada — Jewelry Store Frontend

<p align="center">
  <img src="src/assets/img/logo.png" alt="GOLD by Descaleinada" width="300">
</p>

<p align="center">
  <strong>E-commerce frontend para una joyería premium</strong><br>
  Desarrollado con Angular 21 · Desplegado en AWS EC2
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white" alt="Angular 21">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/RxJS-7.8-B7178C?logo=reactivex&logoColor=white" alt="RxJS">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/AWS-EC2-FF9900?logo=amazonaws&logoColor=white" alt="AWS EC2">
</p>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura](#-arquitectura)
- [Despliegue](#-despliegue)
- [Autores](#-autores)

---

## 📖 Descripción

**GOLD by Descaleinada** es una tienda de joyería online con diseño premium. El frontend consume una API REST (Node.js + Express + MongoDB) y ofrece una experiencia de usuario moderna con autenticación JWT, autorización por roles, carrito de compras, favoritos y un dashboard administrativo.

---

## ✨ Características

### 🛍️ Cliente

- **Catálogo de productos** por categoría (Rings, Earrings, Bracelets, Necklaces)
- **Búsqueda en tiempo real** — barra de búsqueda inline integrada en el header
- **Detalle de producto** con imagen, descripción y precio
- **Carrito de compras** — agregar, eliminar, actualizar cantidades
- **Lista de favoritos** — guardar productos para después
- **Diseño responsive** — optimizado para móvil y escritorio

### 🔐 Autenticación y Seguridad

- **Login y registro** con validación de formularios
- **JWT** — tokens almacenados en localStorage
- **Guards** — protección de rutas por autenticación y roles
- **Interceptor inteligente** — auto-logout en tokens expirados, no envía tokens en rutas públicas
- **Roles** — `registered`, `cliente`, `admin` (mínimo 2 roles por usuario)

### 👑 Administrador (Dashboard)

- **CRUD de productos** — crear, editar, listar
- **CRUD de categorías** — crear, editar, listar
- **CRUD de colecciones** — crear, editar, listar
- **Gestión de usuarios** — crear nuevos usuarios con roles

### 🎨 Diseño

- **Glassmorphism** en el header (semi-transparente con blur)
- **Carrusel hero** con autoplay y scroll infinito (solo desktop)
- **Product cards** con hover effects, shimmer borders y gradientes
- **Menú hamburguesa** en mobile con categorías y íconos gem
- **Paleta premium** — dorados (#d4af37), oscuros (#1a1a2e), tipografía Playfair Display

---

## 🛠️ Tech Stack

| Tecnología       | Versión | Uso                          |
| ---------------- | ------- | ---------------------------- |
| **Angular**      | 21      | Framework frontend           |
| **TypeScript**   | 5.9     | Lenguaje de programación     |
| **RxJS**         | 7.8     | Programación reactiva        |
| **Font Awesome** | 7.1     | Iconografía                  |
| **CSS3**         | —       | Estilos (sin frameworks CSS) |
| **Vitest**       | 4.0     | Testing                      |

---

## 📦 Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** >= 21.x (se instala con el proyecto)
- **Backend** corriendo en `localhost:3000` (o en AWS EC2)

---

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/jewelry-store-frontend.git
cd jewelry-store-frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
ng serve
# o
npm start
```

La app estará disponible en `http://localhost:4200`

---

## 🌐 Variables de Entorno

El proyecto usa **Angular environments** para manejar las URLs del backend:

### Desarrollo (`src/environments/environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
};
```

### Producción (`src/environments/environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://tu-servidor-aws:3000/api/v1',
};
```

> ⚠️ **Importante**: Actualiza `apiUrl` en `environment.prod.ts` con la IP o dominio de tu servidor antes de hacer build de producción.

---

## 📜 Scripts Disponibles

| Comando                               | Descripción                                          |
| ------------------------------------- | ---------------------------------------------------- |
| `npm start`                           | Inicia el servidor de desarrollo en `localhost:4200` |
| `ng serve --host 0.0.0.0`             | Servidor accesible desde red local                   |
| `npm run build`                       | Build de producción en `/dist`                       |
| `ng build --configuration production` | Build de producción con environment swap             |
| `npm test`                            | Ejecuta tests con Vitest                             |

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                          # Servicios e infraestructura
│   │   ├── guards/                    # Guards de rutas
│   │   │   ├── auth-guard.ts          # Protege rutas autenticadas
│   │   │   ├── public-guard.ts        # Redirige si ya logueado
│   │   │   └── role-guard.ts          # Verifica roles permitidos
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts    # Agrega JWT + auto-logout en 401
│   │   ├── models/
│   │   │   └── product.interface.ts   # Interfaz TypeScript de Product
│   │   └── services/                  # Servicios HTTP
│   │       ├── http-auth.ts           # Login, registro, token
│   │       ├── http-cart.ts           # Carrito de compras
│   │       ├── http-product.ts        # Productos y categorías
│   │       └── ...
│   ├── features/pages/                # Páginas de la aplicación
│   │   ├── home/                      # Página principal + carrusel
│   │   ├── login/                     # Formulario de login
│   │   ├── register/                  # Formulario de registro
│   │   ├── rings/                     # Categoría: Anillos
│   │   ├── earrings/                  # Categoría: Aretes
│   │   ├── bracelets/                 # Categoría: Pulseras
│   │   ├── necklaces/                 # Categoría: Collares
│   │   ├── product-detail/            # Detalle de producto
│   │   ├── cart/                      # Carrito de compras
│   │   ├── favorites/                 # Lista de favoritos
│   │   ├── dashboard/                 # Panel administrativo
│   │   ├── products/                  # CRUD de productos (admin)
│   │   ├── categories/                # CRUD de categorías (admin)
│   │   ├── collections/               # CRUD de colecciones (admin)
│   │   └── user/                      # Gestión de usuarios (admin)
│   ├── shared/
│   │   ├── components/
│   │   │   └── product-card/          # Card reutilizable de producto
│   │   ├── layout/
│   │   │   ├── header/                # Header con búsqueda y menú
│   │   │   └── footer/                # Footer con contacto
│   │   └── styles/
│   │       └── category-page.css      # Estilos compartidos de categorías
│   ├── app.routes.ts                  # Definición de rutas
│   ├── app.ts                         # Componente raíz
│   └── app.config.ts                  # Configuración de Angular
├── assets/
│   └── img/                           # Imágenes y recursos gráficos
│       ├── logo.png                   # Logo de la marca
│       ├── background-*.png           # Imágenes hero de categorías
│       ├── backgroud-modelos-*.png    # Carrusel principal
│       ├── sponsor-*.png              # Logos de marcas asociadas
│       └── metodos-de-pago.png        # Métodos de pago
├── environments/
│   ├── environment.ts                 # Config desarrollo (localhost)
│   └── environment.prod.ts            # Config producción (AWS EC2)
└── public/                            # Archivos estáticos raíz (favicon)
```

---

## 🏗️ Arquitectura

```
┌─────────────┐     HTTP + JWT     ┌──────────────┐     Mongoose     ┌─────────────┐
│   Angular   │ ◄──────────────►   │  Node.js /   │ ◄──────────────► │  MongoDB    │
│   Frontend  │   X-Token header   │  Express API │                  │  Atlas      │
└─────────────┘                    └──────────────┘                  └─────────────┘
      │                                   │
      ├── Guards (auth, role, public)     ├── JWT Authentication
      ├── Interceptor (token + 401)       ├── Role-based Authorization
      ├── Services (HTTP calls)           ├── CRUD Endpoints
      └── Components (UI)                 └── Middleware (validaciones)
```

### Flujo de Autenticación

1. Usuario hace login → backend devuelve `token` + `user`
2. Se guarda en `localStorage`
3. El **interceptor** agrega `X-Token` a peticiones protegidas
4. Si el token expira (401) → interceptor limpia sesión y redirige a `/login`
5. Rutas públicas (`/product`, `/category`) **NO** envían token

### Sistema de Roles

| Rol          | Permisos                  |
| ------------ | ------------------------- |
| `registered` | Acceso básico             |
| `cliente`    | Carrito + Favoritos       |
| `admin`      | Dashboard + CRUD completo |

> Todos los usuarios tienen mínimo 2 roles: `registered` + `cliente`

---

## 🚀 Despliegue

### Build de Producción

```bash
# Generar build optimizado
ng build --configuration production

# Los archivos se generan en /dist/frontend/browser/
```

### Despliegue en AWS EC2

1. Hacer build de producción
2. Subir contenido de `/dist/frontend/browser/` al servidor
3. Servir con **Nginx** o similar:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/jewelry-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

> `try_files ... /index.html` es **obligatorio** para que las rutas de Angular funcionen (SPA routing).

---

## 👥 Autores

- **Felipe Cardenas** — Desarrollo Frontend & Backend
- **Ronald Guerrero** — Desarrollo Frontend & Backend

---

<p align="center">
  <sub>Hecho con ❤️ y mucho ☕ — 2026</sub>
</p>
