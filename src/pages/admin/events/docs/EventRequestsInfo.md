# EventRequestsInfo.md

## Descripción
`EventRequests` es un componente React que permite gestionar y visualizar las solicitudes de empresas para participar en eventos. Proporciona filtros avanzados, acciones de aceptación/rechazo y una interfaz accesible y reutilizable.

## Props
Actualmente, el componente no recibe props, pero está diseñado para ser fácilmente extensible y reutilizable.

## Ejemplo de uso
```jsx
import EventRequests from './EventRequests';

function AdminPanel() {
  return <EventRequests />;
}
```

## Accesibilidad
- Todos los elementos interactivos incluyen `aria-label` y roles apropiados.
- Navegación por teclado soportada en enlaces y acciones.

## Extensión y reutilización
- La lógica de negocio está separada en el hook `useEventRequests` para facilitar la reutilización y pruebas.
- El componente puede recibir props en el futuro para personalizar filtros, acciones o datos.

## Dependencias
- Ant Design (`antd`)
- Zustand
- Lucide React

## Ubicación
`src/pages/admin/events/EventRequests.jsx`

## Hooks personalizados
- `useEventRequests`: Maneja la lógica de carga, filtrado y acciones sobre las solicitudes de eventos. Ubicado en `src/pages/admin/events/hooks/useEventRequests.js`.

## Mantenimiento
- Para agregar nuevos filtros o acciones, modifique el hook y/o el renderizado de filtros y acciones en el componente.
- Siga las convenciones de accesibilidad y validación de props.
