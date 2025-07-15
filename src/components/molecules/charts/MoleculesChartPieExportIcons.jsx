import React from "react";
import { FileSpreadsheet, ImageDown } from "lucide-react";

function MoleculesChartPieExportIcons({ onDownloadImage, onDownloadExcel }) {
  return (
    <div
      className="flex gap-2 absolute right-3 top-3 z-10 bg-white/80 rounded-md shadow-sm"
      style={{ backdropFilter: 'blur(2px)' }}
    >
      <span
        className="cursor-pointer p-1 rounded hover:bg-muted transition-colors"
        onClick={onDownloadImage}
        title="Descargar imagen"
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        <ImageDown className="w-5 h-5 text-muted-foreground" />
      </span>
      <span
        className="cursor-pointer p-1 rounded hover:bg-muted transition-colors"
        onClick={onDownloadExcel}
        title="Descargar Excel"
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
      </span>
    </div>
  );
}

export default MoleculesChartPieExportIcons;
