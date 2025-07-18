# RegisterProductsInfo.md

## Descripción
`RegisterProducts` es un componente de página que centraliza el registro de productos en la aplicación. Presenta un panel de encabezado y un formulario reutilizable para la creación de productos, permitiendo además la extensión mediante la prop `children`.

## Props
| Prop           | Tipo           | Requerido | Descripción                                      |
|----------------|----------------|-----------|--------------------------------------------------|
| panelTitle     | string         | No        | Título del panel. Por defecto: 'Productos'.      |
| panelSubtitle  | string         | No        | Subtítulo del panel. Por defecto: 'Registro de productos'. |
| children       | React.ReactNode| No        | Elementos adicionales a renderizar debajo del formulario. |

## Accesibilidad
- El panel principal tiene `aria-label` descriptivo.
- El contenedor del formulario tiene `role="region"` y `aria-label` para facilitar la navegación asistida.

## Ejemplo de uso
```jsx
import RegisterProducts from './ProductsRegister';

function Example() {
  return (
    <RegisterProducts panelTitle="Mis Productos" panelSubtitle="Alta de productos">
      <div>Contenido adicional debajo del formulario</div>
    </RegisterProducts>
  );
}
```

## Extensión
Puedes pasar elementos adicionales como hijos (`children`) para agregar contenido personalizado debajo del formulario de productos.

## Notas
- Si se requiere lógica personalizada (por ejemplo, hooks para manejo de estado o efectos), debe ubicarse en `src/pages/products/hooks/` y ser importada en este componente.
- No se detectó lógica compleja en la versión actual, por lo que no se extrajo ningún helper ni hook personalizado.
