# FeedEventInfo.md

## Descripción
`FeedEvent` es un componente de React que muestra un listado de eventos disponibles y permite a la empresa actual registrarse en uno de ellos. Utiliza un helper externo para separar la lógica de negocio y mantener el componente limpio y reutilizable.

## Props
Actualmente, el componente no recibe props, pero está preparado para ser extendido en el futuro.

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| -    | -    | -         | -           |

## Ejemplo de uso
```jsx
import FeedEvent from './FeedEvent';

function App() {
  return <FeedEvent />;
}
```

## Accesibilidad
- Los botones y elementos interactivos incluyen `aria-label` y `tabIndex` para navegación por teclado.
- Las imágenes incluyen `alt` descriptivo y `role`.

## Lógica separada
La lógica de negocio (fetch de eventos, registro y modal de éxito) se encuentra en `src/pages/events/helpers/feedEventHelper.js`.

## Extensión y reutilización
- El componente puede ser extendido fácilmente para aceptar props de filtros, callbacks o custom actions.
- La lógica de registro y fetch puede ser reutilizada en otros componentes relacionados a eventos.

## Buenas prácticas
- Validación de props con PropTypes (preparado para futuras props).
- Documentación JSDoc en el componente y helpers.
- Código limpio, legible y fácil de mantener.

## Justificación de reglas no aplicadas
- No se crean hooks personalizados ya que la lógica extraída no requiere estado propio ni ciclo de vida, solo helpers.
- No se validan props porque el componente no recibe ninguna actualmente.
