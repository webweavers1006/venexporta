import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { truncate } from "@/lib/companiesGrid";

const DEFAULT_IMAGE_URL = "https://via.placeholder.com/160x160?text=Sin+Logo";

const DefaultItemCard = React.memo(function DefaultItemCard({ item, onClick, itemClassName, maxNameLength }) {
  return (
    <Card
      onClick={() => onClick(item.id, item)}
      className={cn("group cursor-pointer border-none shadow-none bg-zinc-100/50 hover:bg-zinc-100 transition-colors", itemClassName)}
    >
      <CardContent className="flex flex-col items-center p-5">
        <div className="relative mb-2 flex items-center justify-center overflow-hidden">
          <img
            src={item.url || DEFAULT_IMAGE_URL}
            alt={item.nombre}
            loading="lazy"
            decoding="async"
            className="mask mask-squircle w-32 h-32 object-cover"
            onError={(e)=>{ e.currentTarget.src = DEFAULT_IMAGE_URL; }}
          />
        </div>
        <p className="mt-1 text-center text-xs font-medium text-zinc-800 leading-snug line-clamp-2">
          {truncate(item?.nombre || "Sin nombre", maxNameLength)}
        </p>
      </CardContent>
    </Card>
  );
});
DefaultItemCard.displayName = 'DefaultItemCard';

export default DefaultItemCard;