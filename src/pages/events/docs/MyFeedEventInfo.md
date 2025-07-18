# MyFeedEvent (MyEvents)

Componente de React para mostrar y gestionar los eventos en los que una empresa está registrada. Permite visualizar información relevante de cada evento y cancelar la participación en los mismos.

## Props

Este componente no recibe props directamente, ya que obtiene el id de la empresa desde el store global. Sin embargo, los componentes hijos sí reciben props validadas.

## Ejemplo de uso

```jsx
import MyFeedEvent from './MyFeedEvent';

function App() {
  return <MyFeedEvent />;
}
```

## Accesibilidad
- Los botones de acción incluyen `aria-label` y roles adecuados.
- Las imágenes incluyen el atributo `alt` descriptivo.
- El modal de confirmación es accesible por teclado.

## Hooks personalizados
- `useMyEventsData`: Encapsula la lógica de obtención y recarga de eventos.

## Extensión y reutilización
- La lógica de obtención de datos está separada en un hook reutilizable.
- El componente es fácilmente extensible para agregar más acciones o filtros.

## Ubicación
- Componente: `src/pages/events/MyFeedEvent.jsx`
- Hook: `src/pages/events/hooks/useMyEventsData.js`
- Documentación: `src/pages/events/docs/MyFeedEventInfo.md`

## Notas
- Si se requiere modificar la lógica de obtención de eventos, hacerlo en el hook personalizado.
- Si se agregan nuevas acciones, validar accesibilidad y documentar en este archivo.
