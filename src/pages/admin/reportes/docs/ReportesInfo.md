# ReportesInfo.md

## Descripción
Componente de reportes administrativos para el sistema Venexporta. Permite descargar reportes generales de empresas y reportes filtrados por evento, facilitando la gestión y análisis de datos para administradores.

## Props
Este componente no recibe props actualmente, pero está preparado para ser extendido en el futuro.

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| -    | -    | -         | -           |

## Hooks personalizados
- `useEventos(idCompany)`: Encapsula la lógica de carga de eventos asociados a la compañía.

## Accesibilidad
- Todos los elementos interactivos cuentan con roles, aria-labels y soporte para navegación por teclado.

## Ejemplo de uso
```jsx
import Reportes from './Reportes';

function AdminPage() {
  return <Reportes />;
}
```

## Extensión
- Para agregar nuevos tipos de reportes, basta con añadir nuevos enlaces o componentes reutilizando la estructura y lógica actual.

## Ubicación
`src/pages/admin/reportes/Reportes.jsx`

## Autoría y mantenimiento
- Refactorizado siguiendo buenas prácticas de escalabilidad, accesibilidad y mantenibilidad.
