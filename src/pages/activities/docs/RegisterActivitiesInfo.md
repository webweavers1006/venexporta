# RegisterActivities

Componente React para registrar y mostrar actividades económicas y permitir el registro de actividades para empresas.

## Props

| Prop           | Tipo     | Requerido | Descripción                        |
| -------------- | -------- | --------- | ---------------------------------- |
| (N/A)          |          |           | Actualmente no recibe props, pero es extensible |

## Ejemplo de uso

```jsx
import RegisterActivities from './RegisterActivities';

function App() {
  return <RegisterActivities />;
}
```

## Accesibilidad
- Los elementos interactivos tienen roles, aria-labels y soporte de teclado.
- El botón de registro y los selects son accesibles y navegables por teclado.

## Extensión y reutilización
- El componente está preparado para aceptar props en el futuro.
- La lógica de negocio está separada en el hook `useRegisterActivities` para facilitar la reutilización y escalabilidad.
- Helpers como `getMaxLength` permiten personalizar validaciones fácilmente.
