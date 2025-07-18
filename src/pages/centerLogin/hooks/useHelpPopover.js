import { useCallback } from 'react';

/**
 * Hook para manejar la lógica del popover de ayuda.
 * @returns {Object} Props de accesibilidad y handlers para el trigger del popover.
 */
export function useHelpPopover() {
  const getTriggerProps = useCallback(() => ({
    tabIndex: 0,
    role: 'button',
    'aria-label': 'Abrir ayuda',
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.target.click();
      }
    },
  }), []);

  return { getTriggerProps };
}
