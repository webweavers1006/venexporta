import { useMemo } from 'react';
import {
  ACTIVIDAD_COLORS,
  getActividadColorMap,
  getSelectedActividadColor,
  getSectoresPalette,
  getSubSectoresPalette
} from '../helpers/chartColors';

export function useDashboardColors(cantSubSector, selectedActividadId, selectedSectorId) {
  // Mapeo de actividad económica a color
  const actividadColorMap = useMemo(() =>
    getActividadColorMap(cantSubSector?.actividadesEconomicas, ACTIVIDAD_COLORS),
    [cantSubSector]
  );

  // Color base de la actividad seleccionada
  const selectedActividadColor = useMemo(() =>
    getSelectedActividadColor(selectedActividadId, actividadColorMap, ACTIVIDAD_COLORS[0]),
    [selectedActividadId, actividadColorMap]
  );

  // Paleta de degradados para sectores económicos
  const sectoresPalette = useMemo(() =>
    getSectoresPalette(cantSubSector?.sectoresEconomicos, selectedActividadId, selectedActividadColor),
    [cantSubSector, selectedActividadId, selectedActividadColor]
  );

  // Paleta de degradados para subsectores económicos
  const subSectoresPalette = useMemo(() =>
    getSubSectoresPalette(
      cantSubSector?.subSectoresEconomicos,
      cantSubSector?.sectoresEconomicos,
      selectedActividadId,
      selectedSectorId,
      sectoresPalette
    ),
    [cantSubSector, selectedActividadId, selectedSectorId, sectoresPalette]
  );

  return {
    ACTIVIDAD_COLORS,
    actividadColorMap,
    selectedActividadColor,
    sectoresPalette,
    subSectoresPalette
  };
}
