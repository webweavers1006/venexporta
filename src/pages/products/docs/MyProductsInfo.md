# MyProductsInfo.md

## Descripción
`MyProducts` es un componente de React que muestra una tabla de productos asociados a una compañía específica. Utiliza Ant Design para la tabla y mensajes, y permite recargar los datos de productos. Es reutilizable y extensible para diferentes contextos donde se requiera mostrar productos de una compañía.

## Props
| Prop         | Tipo           | Requerido | Descripción                                      |
|--------------|----------------|-----------|--------------------------------------------------|
| idCompany    | string/number  | Sí        | ID de la compañía cuyos productos se listan.      |
| columns      | array          | Sí        | Columnas para la tabla de productos.              |
| panelTitle   | string         | No        | Título del panel.                                |
| panelSubtitle| string         | No        | Subtítulo del panel.                             |

## Ejemplo de uso
```jsx
import MyProducts from './MyProducts';
import columns from './columns/columnsMyProducts';

<MyProducts
  idCompany={123}
  columns={columns}
  panelTitle="Mis Productos"
  panelSubtitle="Información de los productos registrados"
/>
```

## Accesibilidad
- La tabla tiene el rol `table` y aria-label descriptivo.
- Los mensajes de información son accesibles para lectores de pantalla.

## Extensión
- Puede personalizarse pasando diferentes columnas o títulos.
- Permite integración con otros hooks o lógica de filtrado/exportación.

## Notas
- La lógica de carga de productos está separada en el hook `useProductsByCompany`.
- El componente es robusto ante errores y adaptable a dispositivos móviles.
