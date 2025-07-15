export const filterValues = (array, llave, busqueda) =>{
    const result = array.filter(a => a[llave] == busqueda );
    return result
}