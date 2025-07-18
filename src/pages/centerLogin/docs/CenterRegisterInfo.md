# CenterRegister

## Descripción
Componente reutilizable y accesible para mostrar el formulario de registro de centros, con ayuda contextual y soporte para personalización.

## Props
| Prop      | Tipo     | Requerido | Descripción                                      |
|-----------|----------|-----------|--------------------------------------------------|
| className | string   | Opcional  | Clase CSS adicional para el contenedor principal. |
| ...props  | object   | Opcional  | Props adicionales para el contenedor.             |

## Ejemplo de uso
```jsx
import CenterRegister from './pages/centerLogin/Signup';

<CenterRegister className="mi-clase" />
```

## Accesibilidad
- El botón de ayuda tiene `aria-label` y es navegable por teclado.
- El modal de ayuda tiene roles y descripciones.

## Extensión
Puedes envolver el componente o pasarle props adicionales para personalizar su comportamiento o estilos.
