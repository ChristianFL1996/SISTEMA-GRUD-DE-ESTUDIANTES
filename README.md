# Sistema de Gestión de Estudiantes (GRUD)

Este proyecto es un sistema web completo (CRUD) para la gestión de estudiantes. Se divide en dos componentes principales:
- **Frontend**: Aplicación desarrollada en Angular 17.2+ (`SISTEMA_GRUD_FRONTEND`).
- **Backend API**: Servidor en Node.js con Express y MySQL2 (`examen-backend`).

---

## 📁 Estructura del Proyecto

A continuación, se detalla la estructura principal de los directorios instalados y desarrollados en este repositorio:

```text
SISTEMAS/
├── SISTEMA_GRUD_FRONTEND/       # Proyecto Frontend (Angular)
│   ├── src/                     # Código fuente de Angular
│   │   ├── app/                 # Módulo principal de la aplicación
│   │   │   ├── components/      # Componentes UI (estudiante-list, estudiante-form, etc.)
│   │   │   ├── models/          # Interfaces y modelos de datos (estudiante.model.ts)
│   │   │   └── services/        # Servicios para comunicación con la API (estudiante.service.ts)
│   │   └── index.html           # Plantilla HTML principal
│   ├── package.json             # Dependencias del frontend
│   └── angular.json             # Configuración de Angular CLI
│
├── examen-backend/              # Proyecto Backend (Node.js + Express)
│   ├── src/                     # Código fuente de Node.js
│   │   ├── config/              # Configuración de base de datos (db.js)
│   │   ├── controllers/         # Lógica de negocio y controladores (estudianteController.js)
│   │   └── routes/              # Definición de rutas y endpoints de la API (estudianteRoutes.js)
│   ├── index.js                 # Punto de entrada principal e inicialización del servidor
│   ├── .env                     # Variables de entorno y credenciales (Asegúrate de crearlo/modificarlo)
│   └── package.json             # Dependencias del backend (express, cors, mysql2, dotenv)
│
├── Credenciales MySQL/          # Notas y configuraciones del servidor de Base de Datos
└── README.md                    # Documentación general del proyecto (Este archivo)
```

---

## ⚙️ Requisitos Previos
- [Node.js](https://nodejs.org/) (versión 18+ recomendada).
- [Angular CLI](https://angular.dev/tools/cli) (versión 17+).
  - Instalar globalmente: `npm install -g @angular/cli`.
- [MySQL](https://www.mysql.com/) (versión 9.6 o compatible) en ejecución en el puerto local `3306`.

---

## 🗄️ 1. Configuración de Base de Datos

El backend requiere una base de datos MySQL con el nombre `sistema_estudiantes`. A continuación, se presenta el script SQL necesario para crear la base de datos y la tabla correspondiente para que todo el sistema funcione correctamente.

### Script SQL (`database.sql`)
Copia y ejecuta el siguiente script en tu cliente de MySQL preferido (MySQL Workbench, phpMyAdmin, DBeaver, o consola MySQL):

```sql
CREATE DATABASE IF NOT EXISTS sistema_estudiantes;
USE sistema_estudiantes;

CREATE TABLE IF NOT EXISTS estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    carnet VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    carrera VARCHAR(100) NOT NULL,
    semestre INT NOT NULL CHECK (semestre BETWEEN 1 AND 12),
    estado VARCHAR(20) DEFAULT 'Activo'
);
```

### Configuración de Credenciales
El backend lee sus configuraciones desde el archivo `examen-backend/.env`. Por defecto, está establecido con las siguientes credenciales de base de datos. Si tu entorno local es diferente, debes modificarlas en dicho archivo:

```env
PORT=3000
DB_HOST=localhost
DB_USER=AdminChristian
DB_PASS=Chri$$1996!
DB_NAME=sistema_estudiantes
```

*Nota: Asegúrate de que tu usuario de MySQL local tenga permisos para esta base de datos, o de lo contrario, ajusta las credenciales en el archivo `.env` por las de tu servidor local (ej. usuario root).*

---

## 🚀 2. Instalación y Ejecución del Backend (Node.js API)

1. Abre una terminal y navega a la carpeta del backend:
   ```bash
   cd examen-backend
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   node index.js
   ```
4. Verás el mensaje en consola: `Servidor escuchando en http://localhost:3000`.

---

## 🎨 3. Instalación y Ejecución del Frontend (Angular)

1. Abre una **nueva** terminal (manteniendo el backend en ejecución) y navega a la carpeta del frontend:
   ```bash
   cd SISTEMA_GRUD_FRONTEND
   ```
2. Instala las dependencias del proyecto Angular:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo de Angular:
   ```bash
   npm run start
   # O utilizando la CLI directamente: ng serve
   ```
4. Abre tu navegador web de preferencia e ingresa a `http://localhost:4200` para interactuar con el sistema de estudiantes.

---

## 📌 Notas Adicionales
- Al probar la aplicación, el frontend se comunicará automáticamente con la API del backend ubicada de forma predeterminada en el puerto `3000` (`http://localhost:3000/api/estudiantes`).
- Asegúrate de tener los puertos `3000` (Backend) y `4200` (Frontend) libres en tu máquina para evitar conflictos al levantar los servicios.


