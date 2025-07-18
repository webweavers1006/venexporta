# DashboardInfo.md

## Descripción

El componente `Dashboard` es el panel principal de administración que muestra gráficos y estadísticas sobre empresas, usuarios, sectores productivos y eventos. Permite filtrar por país y año, mostrando información relevante de manera visual y accesible.

## Props

Actualmente, el componente no recibe props externas, pero está preparado para ser extendido y reutilizado. La validación de props se realiza mediante PropTypes si se agregan nuevas propiedades.

## Accesibilidad
- Todos los elementos interactivos incluyen roles y `aria-labels` descriptivos.
- El loader es accesible por teclado (`tabIndex=0`).

## Ejemplo de uso

```jsx
import Dashboard from './Dashboard';

function AdminPage() {
  return <Dashboard />;
}
```

## Hooks personalizados
- `useDashboardData`: Obtiene los datos principales del dashboard según el país seleccionado.
- `useDashboardEffects`: Maneja la carga y actualización de datos secundarios (países, subsectores, empresas y eventos por año, ranking de eventos).

## Organización del código
- Lógica de efectos secundarios extraída a `hooks/useDashboardEffects.js`.
- Funciones auxiliares separadas del cuerpo principal del componente.
- Imports organizados y mínimos.

## Extensión y reutilización
El componente está diseñado para ser fácilmente extendido, permitiendo agregar nuevos filtros, gráficos o props según necesidades futuras.

## Justificación de reglas no aplicadas
- No se agregaron PropTypes a las props porque actualmente el componente no recibe props externas. Se deja preparado para futuras extensiones.
