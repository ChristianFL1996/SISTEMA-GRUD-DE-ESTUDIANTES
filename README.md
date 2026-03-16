# CRUD Estudiantes - Sistema de Gestión

Sistema completo de gestión de estudiantes aplicando la arquitectura Frontend-Backend. 
El **Backend** está desarrollado en Node.js con Express y conectado a **Supabase** (PostgreSQL). 
El **Frontend** está desarrollado en Angular 18 con estilo responsivo.

## 📁 Estructura del Proyecto

```text
GRUD_ESTUDIANTE/
├── SISTEMA_ESTUDIANTES_API/    # Backend (Node.js + Express)
│   ├── src/config/db.js        # Configuración de base de datos
│   ├── src/index.js            # Punto de entrada de la API REST
│   └── .env                    # Variables de entorno (Debe crearse)
├── SISTEMA_ESTUDIANTES_WEB/    # Frontend (Angular 18+)
│   └── src/app/
│       ├── models/             # Interfaces TypeScript
│       ├── services/           # Servicios HTTP para consumo API
│       └── components/         # Componentes (lista y formulario)
└── README.md                   # Este archivo de documentación
```

## 🛠️ Requisitos Previos

Asegúrate de tener instalados los siguientes programas antes de comenzar:
- **Node.js** (v18 o superior)
- **npm** (v9 o superior)
- **Angular CLI** instalado globalmente:
  ```bash
  npm install -g @angular/cli
  ```
  *(Nota para Windows en PowerShell: Si recibes el error de "ejecución de scripts deshabilitada", puedes habilitarlos ejecutando en una terminal PowerShell como Administrador: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`)*

---

## 🗄️ Configuración de la Base de Datos (Supabase / PostgreSQL)

Para que el backend funcione, necesitas crear un proyecto en **Supabase** y ejecutar el siguiente Script SQL para crear la tabla de la base de datos necesaria:

1. Ve a tu proyecto de Supabase, entra al **SQL Editor** y ejecuta:

```sql
-- Script para crear la tabla 'estudiantes'
CREATE TABLE estudiantes (
  identificacion SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL CHECK (char_length(nombre) >= 3),
  carnet VARCHAR(50) UNIQUE NOT NULL,
  "correo electr" VARCHAR(255) NOT NULL,
  carrera VARCHAR(255) NOT NULL,
  semestre INT4 NOT NULL CHECK (semestre >= 1 AND semestre <= 12),
  estado VARCHAR(20) DEFAULT 'Activo'
);

-- Opcional: Insertar algunos datos de prueba
INSERT INTO estudiantes (nombre, carnet, "correo electr", carrera, semestre, estado) 
VALUES ('Juan Pérez', 'JP-2024-001', 'juan.perez@email.com', 'Ingeniería en Sistemas', 5, 'Activo');
```

2. En Supabase dirígete a **Project Settings -> API** para obtener tus credenciales (Project URL y `anon` public API Key). Se utilizarán en el siguiente paso.

---

## 🚀 Instalación y Ejecución Local

Para ejecutar todo el sistema correctamente, primero debes levantar el Backend y luego el Frontend.

### Paso 1: Configurar y Ejecutar el Backend (API Node.js)

1. Abre una terminal y navega directamente a la carpeta del backend:
   ```bash
   cd SISTEMA_ESTUDIANTES_API
   ```
2. Instala las dependencias del servidor:
   ```bash
   npm install
   ```
3. Crea un archivo llamado `.env` exactamente en la raíz de `SISTEMA_ESTUDIANTES_API/` (al mismo nivel del package.json) con tus credenciales de Supabase del paso anterior:
   ```env
   PORT=4000
   SUPABASE_URL=https://[TU-PROYECTO].supabase.co
   SUPABASE_ANON_KEY=[TU-ANON-KEY-PUBLICA]
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run start
   # o utilizando: node src/index.js
   ```
   Verás en consola el mensaje indicando que el servidor se ejecuta correctamente en `http://localhost:4000` y está conectado. Mantén esta terminal abierta.

### Paso 2: Configurar y Ejecutar el Frontend (Angular)

1. **Abre una nueva terminal aparte** (dejando la del backend encendida) y dirígete a la carpeta del frontend:
   ```bash
   cd SISTEMA_ESTUDIANTES_WEB
   ```
2. Instala las dependencias de Angular:
   ```bash
   npm install
   ```
3. Inicia la aplicación en modo desarrollo:
   ```bash
   ng serve
   ```
   *(Si `ng serve` da un error de instalación global, como alternativa puedes usar `npm run start`)*
4. Abre tu navegador web favorito y entra en: **[http://localhost:4200](http://localhost:4200)** (El sistema se abrirá automáticamente cargando datos del backend y la base de datos).

---

## 📋 Funcionalidades del Sistema

### Lado Cliente (Frontend)
- ✅ Tabla con datos obtenidos desde base de datos.
- ✅ Búsqueda inteligente en tiempo real (por nombre, carné o e-mail).
- ✅ Paginación completa (5, 10 o 20 estudiantes por vista).
- ✅ Creación, Edición y Eliminación validada (CRUD total).
- ✅ Controles SweetAlert2 para eliminar y alertas de notificaciones.

### Lado Servidor (EndPoints API REST)
| Método | Ruta | Descripción |
|--------|------|-------------|
| **GET** | `/api/estudiantes` | Obtener listado de estudiantes (incluye query de paginado paramétros y filtro de búsqueda) |
| **GET** | `/api/estudiantes/:id` | Recuperar datos de un estudiante de manera individual. |
| **POST** | `/api/estudiantes` | Registrar un nuevo estudiante con validaciones pertinentes. |
| **PUT** | `/api/estudiantes/:id` | Actualizar los datos existentes de su ID proporcionado. |
| **DELETE** | `/api/estudiantes/:id` | Eliminar permanentemente al estudiante del sistema. |

---

## 🛑 Detener el Sistema Múltiple

Al terminar tu trabajo, puedes apagar los servidores locales cerrando las terminales o ejecutando:
1. Terminal del Backend (Node): Haz clic en ella y presiona `Ctrl + C`. Acepta si se solicita.
2. Terminal del Frontend (Angular): Haz clic en ella y presiona `Ctrl + C` para matar definitivamente el servicio.
