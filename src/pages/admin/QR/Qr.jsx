import AtomsPanel from '@components/atoms/AtomsPanel';
import CompaniesCarousel from '@components/organisms/companies/OrganismsCompaniesCarousel';
import MoleculesQRCode from '@components/molecules/MoleculesQRCode';
import { useEventRequests } from './hooks/useEventRequests';
import { generateQrPdf } from './pdf/generateQrPdf';
import bannerHeader from '@assets/banner/bannerGreen.webp';
import { QrCode, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import QrSelectableItem from './helpers/QrSelectableItem';


/**
 * Componente para gestionar y visualizar las solicitudes de eventos y empresas asociadas.
 * Permite filtrar, aceptar o rechazar solicitudes de empresas para eventos.
 *
 * @component
 * @example
 * // Uso básico
 * <EventRequests />
 *
 * @returns {JSX.Element}
 */
/**
 * Vista para generación y exportación de QRs por evento.
 * - Permite seleccionar individualmente los QRs a exportar (o todos).
 * - Genera un PDF con encabezado, título/imagen del evento y cada QR seleccionado.
 * - Usa MoleculesQRCode para el renderizado visual de los QRs.
 *
 * Accesibilidad:
 * - Cada tarjeta de QR es clickable y navegable con teclado (Espacio/Enter) para alternar selección.
 */
const QrDinamic = () => {
  const {
    carouselItems,
    filteredCompanies,
    listRef,
    handleItemClick,
  selectedEventName,
  selectedEventImage,
  } = useEventRequests();

  // Estado local para selección de QRs a exportar
  const [selectedSet, setSelectedSet] = useState(() => new Set());
  // Estado de carga del PDF
  const [pdfLoading, setPdfLoading] = useState(false);
  // Pixel ratio de los QR: bajo en navegación, alto temporalmente para exportar
  const [qrPixelRatio, setQrPixelRatio] = useState(1);
  // Ref para el checkbox de "Seleccionar todo" (para estado indeterminado)
  const selectAllRef = useRef(null);

  // Resetear selección cuando cambian los resultados filtrados
  useEffect(() => {
    setSelectedSet(new Set());
  }, [filteredCompanies]);

  /** Lista de índices posibles según el orden en pantalla */
  const allIndexes = useMemo(() => filteredCompanies?.map((_, i) => i) ?? [], [filteredCompanies]);
  /** Índices seleccionados en orden ascendente */
  const selectedIndexes = useMemo(() => Array.from(selectedSet).sort((a, b) => a - b), [selectedSet]);
  /** Flags de selección */
  const hasSelection = selectedIndexes.length > 0;
  const isAllSelected = hasSelection && selectedSet.size === allIndexes.length;
  const isIndeterminate = hasSelection && !isAllSelected;

  // Actualizar estado indeterminado del checkbox de "Seleccionar todo"
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  /**
   * Alterna la selección de un índice específico del grid de QRs.
   * @param {number} idx Índice visual del QR.
   */
  const toggleIndex = useCallback((idx) => {
    setSelectedSet(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }, []);

  /** Alterna la selección de todos los QRs visibles */
  const handleSelectAll = useCallback(() => {
    setSelectedSet(prev => (prev.size === allIndexes.length ? new Set() : new Set(allIndexes)));
  }, [allIndexes]);

  /**
   * Genera y descarga el PDF de QRs. Muestra un spinner durante el proceso.
   * Respeta la selección actual (si hay) usando selectedIndexes.
   */
  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      // Subir calidad temporalmente para el PDF
      setQrPixelRatio(3);
      // Dar tiempo a que los canvas se redibujen con mayor resolución
      await new Promise(resolve => setTimeout(resolve, 250));
      const ok = await generateQrPdf(listRef?.current, filteredCompanies, {
      headerImageSrc: bannerHeader,
      eventTitle: selectedEventName,
      eventTitleColor: '#2c0449',
      eventImageSrc: selectedEventImage,
      eventImageMaxWidth: 60,
      eventImageMaxHeight: 50,
      eventImageCornerRadius: 6,
      eventImageSpacing: 4,
      eventSectionSpacing: 10,
      eventTitleFontSize: 12,
      pageFormat: [215.9, 279.4],
      
      // Hacer el QR un poco más pequeño
      qrScale: 2,
      // Exportar solo los seleccionados si hay selección
      selectedIndexes,
      });
      // Baja de calidad tras exportar (navegación más fluida)
      setQrPixelRatio(1);
      return ok;
    } finally {
      setPdfLoading(false);
    }
  };

  /** Renderiza un item del grid de QRs con selección y accesibilidad */
  const renderQrItem = useCallback(({ index, item, Component, qrProps }) => (
    <QrSelectableItem
      key={item.key ?? index}
      index={index}
      item={item}
      BaseComponent={Component}
      qrProps={qrProps}
      selected={selectedSet.has(index)}
      onToggle={() => toggleIndex(index)}
    />
  ), [selectedSet, toggleIndex]);

  return (
    <>
      <AtomsPanel
        title={'Generacion de QR dinamicos para rueda de negocios'}
        subtitle={'generacion de QR para cada empresa'}
      />
      <div className='p-5 rounded-2xl md:col-span-2 bg-white mt-4 mb-4'>
        <CompaniesCarousel
          items={carouselItems}
          onItemClick={handleItemClick}
          aria-label="Carrusel de eventos"
        />
      </div>
      <div className='bg-white rounded-xl'>
          <div className="flex items-center justify-between gap-3 mb-2 rounded-t-xl py-4 px-4 bg-primary">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={!filteredCompanies?.length || pdfLoading}
              className="inline-flex items-center rounded-md border border-white/60 bg-white/10 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50"
              >
                {pdfLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Generando PDF...
                  </>
                ) : (
                  <>
                    <QrCode className='mr-1 h-4'/>
                    {hasSelection ? 'Descargar seleccionados' : 'Descargar PDF de QRs'}
                  </>
                )}
            </button>
            <div className="flex items-center gap-2 text-white">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/60 bg-white/10 text-teal-600 focus:ring-white/40"
                  ref={selectAllRef}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
                <span className="text-xs">Seleccionar todo</span>
              </label>
              {hasSelection && (
                <button
                  type="button"
                  onClick={() => setSelectedSet(new Set())}
                  className="inline-flex items-center rounded-md border border-white/60 bg-white/10 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  Limpiar selección
                </button>
              )}
            </div>
          </div>
          <div ref={listRef} className='p-4'>
            {filteredCompanies?.length > 0 && (
              <MoleculesQRCode
                value={filteredCompanies}
                showLabel
                size={220}
                gap={16}
                pixelRatio={qrPixelRatio}
                fgColor="#2c0449"
                fgGradient={{ to: '#2c0449', from: '#b2e713', direction: 'vertical' }}
                finderStyle="circle"
                finderColors={{ outer: '#2c0449', inner: '#FFFFFF', dot: '#b2e713' }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                renderItem={renderQrItem}
              />
            )}
          </div>
        </div>
    </>
  );
}


export default QrDinamic;