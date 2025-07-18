# SchedulesEventsInfo.md

## Descripción
Componente para mostrar y gestionar las solicitudes de citas agrupadas por evento y fecha. Incluye filtros, paginación y resumen por estatus. Utiliza un hook personalizado para separar la lógica de negocio y facilitar la escalabilidad y el mantenimiento.

## Props
Actualmente este componente no recibe props, pero está preparado para ser reutilizable y extenderse fácilmente.

## Accesibilidad
- Todos los elementos interactivos incluyen roles y aria-labels.
- Navegación por teclado soportada en tabs y filtros.

## Ejemplo de uso
```jsx
import SchedulesEvents from './SchedulesEvents';

function AdminSchedulesPage() {
  return <SchedulesEvents />;
}
```

## Hooks personalizados
- `useSchedulesEvents`: Encapsula la lógica de carga, filtrado y paginación de eventos y citas.

## Extensión y reutilización
- Para agregar nuevos filtros, solo extiende el hook y el componente de filtros.
- Para cambiar la fuente de datos, modifica el hook personalizado.

## Ubicación
Este archivo debe residir en `src/pages/admin/schedules/docs/SchedulesEventsInfo.md`.
