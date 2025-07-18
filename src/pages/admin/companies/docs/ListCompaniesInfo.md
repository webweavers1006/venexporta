# ListCompanies

Componente de página para mostrar y filtrar la lista de empresas registradas en el sistema.

## Propósito
Permite visualizar todas las empresas, filtrar por RIF y nombre de empresa, y navegar a la vista de detalle de cada empresa.

## Props
Este componente no recibe props directamente, ya que obtiene los datos mediante hooks y llamadas a la API.

## Ejemplo de uso
```jsx
<Route path="/admin/companies" element={<ListCompanies />} />
```

## Accesibilidad
- Los campos de filtro tienen `aria-label` y permiten navegación por teclado.
- Los enlaces a detalles de empresa usan el componente `Link` para navegación accesible.

## Extensión y reutilización
- El filtrado y la lógica de obtención de empresas pueden extraerse a un hook personalizado si se requiere reutilización en otras vistas.
- El componente es fácilmente extensible para agregar más filtros o acciones.

## Ubicación
`src/pages/admin/companies/ListCompanies.jsx`

## Autoría y mantenimiento
- Refactorizado siguiendo buenas prácticas de robustez, escalabilidad y mantenibilidad.
