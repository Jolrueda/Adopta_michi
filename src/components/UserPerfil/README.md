# Componente UserPerfil

## Descripción
Componente de perfil de usuario que muestra información diferenciada según el rol del usuario (administrador o usuario regular). Cumple con los criterios de aceptación de la historia de usuario para visualización de perfil con diferenciación de roles.

## Características Principales

### Para Todos los Usuarios
- ✅ Foto de perfil circular (150x150 px, clicable para actualizar)
- ✅ Nombre completo en tamaño XL
- ✅ Correo electrónico debajo del nombre
- ✅ Fecha de creación de la cuenta ("Miembro desde: DD/MM/AAAA")
- ✅ Botón "Editar Perfil" funcional con modal

### Solo para Administradores
- ✅ Etiqueta "Administrador" con ícono de corona
- ✅ Adopciones Gestionadas: ícono + total de solicitudes aprobadas
- ✅ Total Donado: ícono + suma de donaciones
- ✅ Indicador de privilegios de gestión avanzados

## Componentes Incluidos

### 1. `UserProfileComponent` (index.tsx)
Componente principal que:
- Maneja la autenticación y redirección
- Muestra diferente contenido según el rol
- Gestiona el estado del modal de edición
- Implementa diseño responsivo con Tailwind CSS

### 2. `EditProfileModal` (EditProfileModal.tsx)
Modal de edición que permite:
- Cambiar foto de perfil (URL)
- Editar nombre completo
- Actualizar correo electrónico
- Validación de formulario
- Vista previa de imagen

## Seguridad y Autenticación
- ✅ Verificación de autenticación (redirige a "/" si no está autenticado)
- ✅ Diferenciación de roles ('admin' vs 'regular')
- ✅ Protección de rutas

## Diseño y Accesibilidad
- ✅ Diseño responsivo (mobile-first)
- ✅ Información para lectores de pantalla
- ✅ Estados de carga y error
- ✅ Navegación por teclado
- ✅ Colores con buen contraste
- ✅ Elementos focusables claramente marcados

## Rutas
- `/perfil` - Página de perfil de usuario
- Enlace disponible en el banner de navegación como "Mi Perfil"

## Tipos TypeScript
```typescript
export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  type: 'admin' | 'regular';
  createdAt: Date;
  // Estadísticas de administrador
  adoptionsManaged?: number;
  totalDonated?: number;
};
```

## Uso
El componente se integra automáticamente con el sistema de navegación y está disponible para todos los usuarios autenticados a través del botón "Mi Perfil" en el banner.

```tsx
// El componente se registra automáticamente en App.tsx
<Route path="/perfil" element={<UserProfile />} />
```

## Estados del Componente
1. **Cargando**: Muestra spinner mientras verifica autenticación
2. **Usuario Regular**: Muestra información básica + botón editar
3. **Usuario Administrador**: Muestra información básica + métricas administrativas + botón editar
4. **Modal Abierto**: Permite edición de perfil con validación

## Funcionalidades Futuras
- Subida de archivos para foto de perfil
- Integración con API real
- Historial de cambios de perfil
- Notificaciones de actualización exitosa 