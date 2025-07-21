import { FileSpreadsheet, FileText } from 'lucide-react';
import { useState, useRef } from 'react';
import { exportEmpresasToExcel } from './helpers/exportEmpresasExcel';
import { exportEmpresasToPDF } from './helpers/exportEmpresasPDF';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportesFilterSchema } from '@/schema/reportesFilterSchema';
import { useReportesFilterConfig } from './config/reportesFilterConfigSubSector';
import { Form } from '@src/components/ui/form';
import { Button } from '@/components/ui/button';
import AtomsTitle from '@components/atoms/AtomsTitle';
import MoleculesFiltersGroup from '@components/molecules/filters/MoleculesFiltersGroups';
import { buildDefaultValues } from './helpers/filtersHelpers';
import { useFiltersSubmit } from './hooks/useFiltersSubmit';




/**
 * Componente de reportes administrativos.
 * Permite descargar reportes generales y por evento.
 *
 * @component
 * @example
 * // Uso típico:
 * <Reportes />
 */
const ReportesDinamicosEventosActividad = () => {


  // Estado local para actividad y sector seleccionados
  const [selectedActividad, setSelectedActividadValue] = useState('');
  const [selectedSector, setSelectedSectorValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [reporteData, setReporteData] = useState(null);
  const listRef = useRef(null);

  // Grupos de filtros definidos en config y setters para selects dependientes
  const {
    config: filterConfig,
    setSelectedEstado,
    setSelectedMunicipio
  } = useReportesFilterConfig(selectedActividad, selectedSector);
  // Default values derived from config via helper
  const defaultValues = buildDefaultValues(filterConfig);
  // Formulario y validación
  const form = useForm({
    resolver: zodResolver(reportesFilterSchema),
    defaultValues,
  });
  const { handleSubmit, control, watch, setValue } = form;
  const values = watch();
  const handleFiltersSubmit = useFiltersSubmit((data) => {
    if (!Array.isArray(data) || data == null) {
      setReporteData(null);
      setLoading(false);
      message.error('No se pudo generar el reporte. Intente nuevamente o revise los filtros.');
      return;
    }
    setReporteData(data);
    setLoading(false);
    message.success(`Reporte generado: ${data.length} empresas encontradas.`);
    // Hacer scroll al inicio de la lista cuando se cargan los datos
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    console.log('Filtros aplicados:', data);
  });

  // Envolver el submit para manejar loading
  const onSubmit = async (data) => {
    setLoading(true);
    await handleFiltersSubmit(data);
    // setLoading(false) se maneja en el callback de useFiltersSubmit
    // El resultado queda en reporteData
  };

  // Exportar a Excel
  const handleExportExcel = async () => {
    await exportEmpresasToExcel(reporteData);
  };

  // Exportar a PDF
  const handleExportPDF = () => {
    exportEmpresasToPDF(reporteData);
  };

  return (
    <div>
      <div className='bg-white p-4 rounded-2xl mt-4'>
        <AtomsTitle
          title={'Reporte SubSector'}
          subtitle={'Filtros'}
          className="mb-4"
        />
        <Form {...form} >
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            {/* Grupos de filtros definidos en config */}
            {filterConfig.map((group, idx) => (
              <div className='mb-4 bg-gray-100 px-6 py-4 rounded-2xl' key={group.title}>
                <MoleculesFiltersGroup
                  group={group}
                  control={control}
                  values={values}
                  setValue={setValue}
                  isLast={idx === filterConfig.length - 1}
                  onEstadoChange={id => setSelectedEstado(id)}
                  onMunicipioChange={id => setSelectedMunicipio(id)}
                  onActividadChange={id => {
                    setSelectedActividadValue(id);
                    setSelectedSectorValue('');
                  }}
                  onSectorChange={id => {
                    setSelectedSectorValue(id);
                  }}
                />
              </div>
            ))}
            <div className="flex justify-end mt-4 gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="animate-spin inline-block mr-2 border-2 border-t-transparent border-b-transparent border-white rounded-full w-4 h-4 align-middle"></span>
                    Generando reporte...
                  </>
                ) : (
                  'Generar reporte'
                )}
              </Button>
              {Array.isArray(reporteData) && reporteData.length > 0 && (
                <>
                  <Button onClick={handleExportExcel} className="bg-green text-primary" type="button">
                    <FileSpreadsheet className="inline-block mr-2 w-4 h-4 align-text-bottom" />
                    Exportar a Excel
                  </Button>
                  <Button onClick={handleExportPDF} className="bg-green text-primary" type="button">
                    <FileText className="inline-block mr-2 w-4 h-4 align-text-bottom" />
                    Exportar a PDF
                  </Button>
                </>
              )}
            </div>
        </form>
      </Form>
    </div>

    {/* Ya no se muestra el botón de exportar aquí, solo junto al botón de aplicar filtros */}
  </div>
  );
};

ReportesDinamicosEventosActividad.propTypes = {};

export default ReportesDinamicosEventosActividad;