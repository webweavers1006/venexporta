# HomeInfo.md

## Descripción

El componente `Home` es la pantalla principal de inicio para usuarios autenticados en Venexporta. Muestra un panel de bienvenida, un carrusel de eventos asociados a la empresa y un módulo de horarios. Si el usuario no está registrado en ningún evento, se muestra un mensaje de advertencia y un botón para navegar a la sección de eventos.

## Props

Este componente no recibe props directamente, ya que utiliza hooks y el store global para obtener la información necesaria.

## Accesibilidad
- Todos los elementos interactivos incluyen `aria-label` descriptivos.
- El botón para navegar a eventos es accesible por teclado (`tabIndex=0`).
- Las secciones principales tienen roles y etiquetas ARIA.

## Ejemplo de uso

```jsx
import Home from '@src/pages/home/Home';

function App() {
  return <Home />;
}
```

## Hooks y lógica extraída
- La lógica de obtención de eventos y bloques de horario se encuentra en el hook personalizado `useHomeEvents` (`src/hooks/useHomeEvents.js`).

## Reutilización y extensión
- El componente es fácilmente reutilizable y extensible, ya que la lógica de negocio está desacoplada mediante hooks y helpers.
- Para modificar la obtención de eventos o la lógica de horarios, solo es necesario modificar el hook correspondiente.

## Justificación de reglas no aplicadas
- No se definen PropTypes porque el componente no recibe props externas. Si en el futuro se parametriza, se recomienda definirlos en la sección `Home.propTypes`.

## Mantenimiento
- El código está organizado y documentado siguiendo las mejores prácticas para facilitar su mantenimiento y escalabilidad.
