# ForgotPasswordInfo.md

## Descripción
Componente de página para recuperación de contraseña. Muestra un formulario de recuperación y un popover de ayuda accesible.

## Props
| Prop      | Tipo     | Requerido | Descripción                                 |
|-----------|----------|-----------|---------------------------------------------|
| className | string   | No        | Clases CSS adicionales para el contenedor.  |
| ...props  | object   | No        | Props adicionales para el elemento section. |

## Accesibilidad
- El botón de ayuda tiene `aria-label` y es navegable por teclado.
- El popover tiene rol de diálogo.

## Ejemplo de uso
```jsx
import ForgotPassword from './ForgotPassword';

function App() {
  return <ForgotPassword className="mi-clase" />;
}
```

## Extensión
- Puedes reemplazar el formulario o el contenido del popover pasando props adicionales o componiendo el componente.

## Ubicación
`src/pages/user/ForgotPassword.jsx`
