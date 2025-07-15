import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "antd";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const DEFAULT_IMAGE_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC5F52ynaRIN577hgyivShpnSw6iHDH_dDAg&s";

const CompanyCarousel = ({ items }) => {
  return (
    <div className="flex justify-center w-full">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-5xl px-2"
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center">
                    <Image
                      width="100%"
                      height={200}
                      src={item.url || DEFAULT_IMAGE_URL}
                      alt={item.nombre}
                      className="rounded-t-md object-cover w-full h-[180px] sm:h-[200px]"
                      style={{ objectFit: "cover" }}
                      preview={false}
                    />
                    <div className="mt-2 text-center w-full">
                      <p className="text-lg font-semibold break-words">{item.nombre}</p>
                      <p className="text-sm text-gray-500">{item.codigo_arancelario}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CompanyCarousel;
