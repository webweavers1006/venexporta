# CompaniesInfo.md

## Descripción

`Companies` es un componente de página que muestra los eventos de la rueda de negocios y permite filtrar y visualizar empresas asociadas a cada evento. Incluye filtros avanzados por actividad, subsector, capítulo y código de producto, así como ayudas contextuales y accesibilidad mejorada.

## Props

Este componente no recibe props directamente, ya que obtiene el contexto de la empresa desde el store global. Sin embargo, utiliza hooks personalizados y helpers para separar la lógica y facilitar la extensión.

## Ejemplo de uso

```jsx
import Companies from './Companies';

function RoundtablePage() {
  return <Companies />;
}
```

## Accesibilidad
- Todos los elementos interactivos tienen `aria-label` y soporte para navegación por teclado.
- Los filtros y botones son accesibles y cuentan con tooltips contextuales.

## Extensión y reutilización
- La lógica de empresas asociadas está en el hook `useAssociatedCompanies`.
- El formateo de eventos está en el helper `getFormattedEvents`.
- Se puede extender fácilmente agregando nuevos filtros o modificando la UI.

## Dependencias
- Zustand (store global)
- Ant Design (Select, Input, message)
- Lucide-react (íconos)
- Componentes internos: AtomsPanel, CompaniesCarousel, MoleculesList, AtomsPopoverHelpButton, ResultComponent, Button

## Buenas prácticas aplicadas
- Validación de props con PropTypes (aunque no recibe props actualmente).
- Separación de lógica en hooks y helpers.
- Documentación JSDoc en el componente y hooks.
- Accesibilidad y roles.
- Código limpio y organizado.

---

> **Nota:** Si se agregan props al componente, actualizar la sección de Props y la validación con PropTypes.
