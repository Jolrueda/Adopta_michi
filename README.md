# Adopta un Michi 🐱

¡Bienvenido a **Adopta un Michi**! Una plataforma web moderna y completa para la adopción responsable de gatos, desarrollada específicamente para la comunidad universitaria de la Universidad Nacional de Colombia.

## ✨ Características principales

### 🔐 **Sistema de Autenticación Institucional**
- Registro y login exclusivo para usuarios con correo @unal.edu.co
- Validación en tiempo real del formato de correo institucional
- Sistema de tipos de usuario (regular y administrador)
- Interfaz de autenticación moderna y responsiva

### 🏠 **Página Principal Interactiva**
- Visualización de todos los gatos disponibles para adopción
- **Sistema de filtros avanzado:**
  - Filtro por disponibilidad (Disponible, Adoptado, Todos)
  - Filtro por estado de salud (Bueno, Regular, Crítico)
  - Filtro por condiciones especiales
- **Paginación inteligente** para navegar fácilmente entre los gatos
- Banner informativo y llamativo

### 📋 **Perfiles Detallados de Gatos**
- **Galería de imágenes** con múltiples fotos de cada gato
- **Información completa:**
  - Nombre, edad y descripción
  - Estado de salud actual
  - Condiciones médicas especiales
  - Estado de disponibilidad
- **Formulario de adopción integrado**

### 📄 **Sistema de Adopción Completo**
- **Formulario de solicitud de adopción** con validación
- Campos requeridos: nombre, teléfono, email institucional
- Mensaje opcional para personalizar la solicitud
- **Validación automática** del dominio @unal.edu.co
- **Actualización automática** del estado del gato tras la solicitud
- Interfaz intuitiva con iconos y retroalimentación visual

### 🎨 **Diseño y Experiencia de Usuario**
- **Diseño completamente responsivo** adaptado a todos los dispositivos
- **UI/UX moderna** con Tailwind CSS
- **Iconografía consistente** con React Icons
- **Animaciones y transiciones suaves**
- **Esquema de colores atractivo** y profesional

## 🏗️ Arquitectura del proyecto

```
Adopta_michi/
├── public/                          # Archivos estáticos
├── src/
│   ├── assets/                      # Recursos multimedia
│   ├── components/                  # Componentes React organizados por funcionalidad
│   │   ├── auth/                    # Sistema de autenticación
│   │   │   ├── AuthLayout.tsx       # Layout principal de auth
│   │   │   ├── RegisterForm.tsx     # Formulario de registro
│   │   │   ├── LoginForm.tsx        # Formulario de login
│   │   │   └── index.tsx           # Exportaciones del módulo
│   │   ├── general/                 # Componentes generales
│   │   │   └── Banner.tsx          # Banner principal
│   │   ├── visualizacion/           # Página principal y listados
│   │   │   ├── MainPage.tsx        # Página principal
│   │   │   ├── CatList.tsx         # Lista de gatos
│   │   │   ├── FilterBar.tsx       # Barra de filtros
│   │   │   └── Pagination.tsx      # Componente de paginación
│   │   ├── CatProfile/              # Perfil detallado de gatos
│   │   │   ├── index.tsx           # Componente principal
│   │   │   ├── AdoptionForm.tsx    # Formulario de adopción
│   │   │   ├── ImageGallery.tsx    # Galería de imágenes
│   │   │   ├── InfoGrid.tsx        # Grid de información
│   │   │   ├── InfoCard.tsx        # Tarjetas de información
│   │   │   ├── PageHeader.tsx      # Encabezado de página
│   │   │   ├── Breadcrumb.tsx      # Navegación breadcrumb
│   │   │   └── AdoptionButton.tsx  # Botón de adopción
│   │   └── UserPerfil/              # Perfil de usuario (en desarrollo)
│   ├── data/
│   │   └── data.json               # Base de datos simulada con usuarios y gatos
│   ├── types/                      # Definiciones de tipos TypeScript
│   ├── utils/
│   │   └── db.ts                   # Utilidades para manejo de datos
│   ├── App.tsx                     # Componente raíz con enrutamiento
│   ├── main.tsx                    # Punto de entrada de la aplicación
│   └── App.css                     # Estilos globales
├── package.json                    # Dependencias y scripts
├── tsconfig.json                   # Configuración TypeScript
├── vite.config.ts                  # Configuración Vite
└── tailwind.config.js              # Configuración Tailwind CSS
```

## 🚀 Instalación y configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Git

### Pasos de instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd Adopta_michi
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Iniciar el servidor JSON (backend simulado):**
   ```bash
   # En una nueva terminal
   npm run start:json-server
   ```

5. **Acceder a la aplicación:**
   - Frontend: `http://localhost:5173`
   - API REST: `http://localhost:3001`

## 📦 Tecnologías utilizadas

### **Frontend**
- **React 19.1.0** - Biblioteca principal para UI
- **TypeScript 5.8.3** - Tipado estático para JavaScript
- **React Router DOM 7.6.1** - Enrutamiento del lado del cliente
- **Tailwind CSS 4.1.7** - Framework CSS utility-first
- **React Icons 5.5.0** - Biblioteca de iconos

### **Herramientas de desarrollo**
- **Vite 6.3.5** - Build tool y servidor de desarrollo
- **ESLint 9.25.0** - Linter para código JavaScript/TypeScript
- **JSON Server 1.0.0-beta.3** - API REST simulada

### **Configuración del proyecto**
- **TypeScript** configurado con tipos estrictos
- **ESLint** con reglas para React y TypeScript
- **Tailwind CSS** con configuración personalizada
- **Vite** optimizado para desarrollo y producción

## 🎯 Funcionalidades en detalle

### **Sistema de Usuarios**
- Validación de correos institucionales (@unal.edu.co)
- Tipos de usuario: regular y administrador
- Autenticación persistente

### **Gestión de Gatos**
- Estados de disponibilidad: Disponible, Adoptado
- Estados de salud: Bueno, Regular, Crítico
- Información completa de cada gato
- Múltiples imágenes por gato

### **Proceso de Adopción**
1. Navegación por gatos disponibles
2. Aplicación de filtros según preferencias
3. Visualización del perfil detallado
4. Solicitud de adopción con formulario validado
5. Actualización automática del estado

## 🔧 Scripts disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run start:json-server  # Inicia el servidor JSON en puerto 3001
```

## 🗄️ Estructura de datos

### **Usuarios**
```json
{
  "id": "string",
  "fullName": "string",
  "email": "string@unal.edu.co",
  "password": "string",
  "type": "regular" | "admin"
}
```

### **Gatos**
```json
{
  "id_gato": "number",
  "nombre": "string",
  "edad": "number",
  "descripcion": "string",
  "estado": "Bueno" | "Regular" | "Crítico",
  "condicion": "string",
  "disponibilidad": "disponible" | "adoptado",
  "fecha_ingreso": "YYYY-MM-DD",
  "imagen": "url",
  "imagen2": "url",
  "imagen3": "url"
}
```

## 🎨 Guía de estilos

- **Colores principales:** Púrpura (#6366f1), Índigo, Grises
- **Tipografía:** Sistema de fuentes nativo
- **Espaciado:** Sistema de spacing de Tailwind
- **Componentes:** Diseño modular y reutilizable
- **Responsive:** Mobile-first approach




## 👥 Equipo de desarrollo

**Desarrollado por:**
- **Julian Orozco Vanegas**
- **Duvan Arley Bolivar David** 
- **Jose Luis Rueda Mayorga**

**Asignatura:** Desarrollo Web 1  
**Universidad:** Universidad Nacional de Colombia

## 📄 Licencia

Este proyecto es parte de un trabajo académico para la Universidad Nacional de Colombia.

---

## 🐾 ¡Adopta, no compres!

*Cada gato merece una segunda oportunidad. Únete a nuestra comunidad y dale un hogar lleno de amor a un michi que lo necesita.*

**¿Listo para encontrar a tu compañero felino ideal? ¡Comienza tu búsqueda ahora!** 🏠✨
