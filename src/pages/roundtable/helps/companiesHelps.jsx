export const companiesHelps = {
  filtersCompany: {
    title: "Filtros de búsqueda por Empresa",
    content: (
      <>
        <p className="text-sm">
          Utiliza los filtros para buscar empresas por actividad economica y sub sector, los filtros se pueden combinar entre si, y estos mismo se aplican a todas a las empresas.
        </p>
      </>
    ),
    side: "right",
    className: "float-right"
  },
  filtersProducts: {
    title: "Filtros de búsqueda de Productos",
    content: (
      <>
        <p className="text-sm">
          Utiliza los filtros para buscar empresas por capítulos o códigos de producto, los filtros se pueden combinar entre si, y estos mismo se aplican a todas a las empresas.
        </p>
      </>
    ),
    side: "right",
    className: "float-right"
  },
  carousel: {
    title: "Eventos Disponibles",
    content: (
      <>
        <p className="text-sm">
          Aquí puedes ver los eventos disponibles. Haz clic en uno para ver las empresas disponibles en la rueda de negocios.
        </p>
      </>
    ),
    side: "left",
    className: "absolute top-3 right-3 z-10"
  },
  list: {
    title: "Lista de Empresas",
    content: (
      <>
        <p className="text-sm">
          Esta sección muestra las empresas asociadas al evento seleccionado. Puedes aplicar filtros para refinar la búsqueda.
        </p>
      </>
    ),
    side: "top",
    className: "absolute top-3 right-3 z-10"
  }
  // ...agrega más ayudas según lo necesites
};
