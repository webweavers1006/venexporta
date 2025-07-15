import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const DEFAULT_IMAGE_URL = "https://via.placeholder.com/150";

const CompaniesCarousel = ({ items, onItemClick, title, subtitle }) => {
  return (
    <Carousel
      opts={{
        align: "center", // Cambiar la alineación para que los elementos nazcan desde el centro
      }}
      className="w-full" // Ajustar el carrusel para que tome todo el ancho disponible
    >
        <div className="flex flex-col items-center w-full">
          <h2 className="text-center text-zinc-900 font-semibold">{title}</h2>	
          <p className="text-center text-sm text-zinc-600">{subtitle}</p>
        </div>
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            className="md:basis-1/3 lg:basis-1/4" // Reducir el tamaño de los ítems
            onClick={() => onItemClick(item.id)} // Llamar a la función onItemClick con el ID del ítem
          >
            <div className="cursor-pointer"> {/* Añadir cursor-pointer */}
              <Card className="border-none shadow-none bg-zinc-100/50">
                <CardContent className="flex flex-col items-center p-4"> {/* Reducir el padding interno */}
                  <img
                    src={item.url || DEFAULT_IMAGE_URL} // Imagen por defecto si no hay URL
                    alt={item.nombre}
                    className="mask mask-squircle w-24 h-24" // Reducir el tamaño de la imagen
                  />
                  <div className="mt-2 text-center"> {/* Texto debajo de la imagen */}
                    <p className="text-xs font-semibold">{item.nombre}</p> {/* Reducir el tamaño del texto */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CompaniesCarousel;
