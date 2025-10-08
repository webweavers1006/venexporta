import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Pagination = React.memo(function Pagination({ page, totalPages, pages, changePage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={()=>changePage(page-1)}
          disabled={page===1}
          className="inline-flex items-center gap-1 rounded-md border bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Prev
        </button>
        <div className="flex items-center gap-1">
          {pages.map((p,i)=> p === '…' ? (
            <span key={i} className="px-2 text-xs text-zinc-400 select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={()=>changePage(p)}
              className={cn(
                "h-7 min-w-7 px-2 rounded-md text-xs font-medium transition-colors",
                p===page ? "bg-primary text-white" : "bg-white border hover:bg-zinc-50"
              )}
            >{p}</button>
          ))}
        </div>
        <button
          type="button"
          onClick={()=>changePage(page+1)}
          disabled={page===totalPages}
          className="inline-flex items-center gap-1 rounded-md border bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50"
        >
          Next <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-xs text-zinc-500">Página {page} de {totalPages}</p>
    </div>
  );
});
Pagination.displayName = 'Pagination';

export default Pagination;