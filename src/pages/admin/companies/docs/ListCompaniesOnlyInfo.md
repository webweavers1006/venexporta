# ListCompaniesOnly

Componente de página para mostrar la información detallada de una empresa, sus documentos y actividades asociadas.

## Propósito
Permite visualizar la información de una empresa seleccionada, gestionar sus documentos (subida y eliminación) y mostrar actividades económicas y subsectores asociados.

## Props
Este componente no recibe props directamente, ya que utiliza los parámetros de la URL (`useParams`).

## Ejemplo de uso
```jsx
<Route path="/admin/companies/:id" element={<ListCompaniesOnly />} />
```

## Hooks personalizados utilizados
- `useCompanyDocuments`: Gestiona la carga, subida y eliminación de documentos asociados a la empresa.

## Accesibilidad
- Los botones de acción incluyen roles y tooltips.
- Los enlaces de documentos tienen atributos `aria-label` y `rel` para accesibilidad y seguridad.

## Extensión y reutilización
- La lógica de documentos está desacoplada mediante un hook reutilizable.
- El componente puede extenderse fácilmente para mostrar más información o acciones.

## Ubicación
`src/pages/admin/companies/ListCompaniesOnly.jsx`

## Autoría y mantenimiento
- Refactorizado siguiendo buenas prácticas de robustez, escalabilidad y mantenibilidad.
