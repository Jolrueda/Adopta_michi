# Adopta un Michi

¡Bienvenido a Adopta un Michi! 🐱

Este proyecto es una plataforma web para la adopción de gatos, desarrollada con React, TypeScript y Tailwind CSS.

## Características principales

- Registro y login de usuarios con validación de correo institucional (@unal.edu.co).
- Formularios modernos y responsivos.
- Arquitectura modular y escalable.
- Componentes reutilizables y estilos personalizados.

## Estructura del proyecto

```
Adopta_michi/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── types.ts
│   │   │   └── MainPage.tsx
│   │   └── visualizacion/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── ...
```

## Instalación y uso

1. Clona el repositorio:
   ```sh
   git clone <url-del-repo>
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```sh
   npm run dev
   ```
4. Abre tu navegador en `http://localhost:5173` (o el puerto que indique la terminal).

## Dependencias principales
- React
- TypeScript
- Tailwind CSS
- React Icons
- Vite

## Notas
- El registro solo permite correos institucionales (@unal.edu.co).
- El proyecto está listo para escalar y agregar nuevas funcionalidades.

## Créditos
Desarrollado por Julian Orozco Vanegas, Duvan Arley Bolivar David y Jose Luis Rueda Mayorga para la asignatura Desarrollo Web 1.

---
¡Adopta, no compres! 🐾
