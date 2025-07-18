# CompaniesOnlyInfo.md

## Descripción
`CompaniesOnly` es un componente de página que muestra información detallada de una empresa seleccionada, incluyendo sus productos, eventos asociados, documentos y bloques de agenda si corresponde. Está diseñado para ser robusto, reutilizable y fácil de mantener, siguiendo buenas prácticas de validación de props, accesibilidad y separación de lógica.

## Estructura
- **CompaniesOnly.jsx**: Componente principal que obtiene los parámetros de la URL y utiliza el hook personalizado `useCompaniesOnly` para cargar los datos.
- **CompaniesOnlyView.jsx**: Componente de presentación que recibe los datos y renderiza la UI.
- **hooks/useCompaniesOnly.js**: Hook personalizado que encapsula la lógica de carga de datos.
- **ProductsList**: Subcomponente reutilizable para mostrar la lista de productos.

## Props de CompaniesOnlyView
| Prop                | Tipo                | Requerido | Descripción                                                        |
|---------------------|---------------------|-----------|--------------------------------------------------------------------|
| renderSchedule      | string              | No        | Si es 'true', muestra el módulo de agenda.                         |
| scheduleBlocks      | object              | No        | Bloques de agenda agrupados por fecha.                             |
| reloadScheduleBlocks| function            | No        | Función para recargar los bloques de agenda.                       |
| id                  | string              | Sí        | ID de la empresa.                                                  |
| event               | string              | No        | ID del evento.                                                     |
| companyEvents       | object/array        | No        | Información de eventos de la empresa.                              |
| subEconomicSectors  | string              | No        | Subsectores económicos de la empresa.                              |
| economicActivities  | string              | No        | Actividades económicas de la empresa.                              |
| companyDocuments    | array               | No        | Documentos de la empresa.                                          |
| productsCompany     | array               | No        | Lista de productos de la empresa.                                  |

## Ejemplo de uso
```jsx
import CompaniesOnly from '../CompaniesOnly';

// En una ruta de React Router
<Route path="/roundtable/companies/:id/:event/:renderSchedule" element={<CompaniesOnly />} />
```

## Accesibilidad
- Todos los elementos interactivos incluyen roles y aria-labels.
- Las imágenes tienen texto alternativo descriptivo.
- Navegación por teclado soportada en los componentes de lista y botones.

## Extensión y reutilización
- El hook `useCompaniesOnly` puede ser reutilizado en otros componentes que requieran la misma lógica de carga de datos.
- El subcomponente `ProductsList` es reutilizable para mostrar listas de productos en otros contextos.

## Notas
- Si se requiere modificar la lógica de carga de datos, hacerlo en el hook personalizado.
- Si se agregan nuevos filtros o vistas, crear subcomponentes y hooks adicionales siguiendo la misma estructura.
