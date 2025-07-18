# EventInfo

Componente React para mostrar información de eventos y permitir el registro de empresas en eventos.

## Props

| Prop           | Tipo     | Requerido | Descripción                        |
| -------------- | -------- | --------- | ---------------------------------- |
| panelTitle     | string   | No        | Título del panel                   |
| panelSubtitle  | string   | No        | Subtítulo del panel                |

## Ejemplo de uso

```jsx
import EventInfo from './EventInfo';

function App() {
  return <EventInfo panelTitle="Eventos" panelSubtitle="Participa en los eventos" />;
}
```

## Accesibilidad
- Los elementos interactivos tienen roles, aria-labels y soporte de teclado.
- El botón de registro es accesible y navegable por teclado.

## Extensión y reutilización
- El componente acepta props para personalizar títulos.
- La lógica de negocio está separada en el hook `useEventInfo` para facilitar la reutilización.

