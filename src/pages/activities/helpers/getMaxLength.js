/**
 * Obtiene la longitud máxima permitida para un campo basado en el schema de validación.
 * @param {Object} schema - Esquema de validación Zod.
 * @param {string} name - Nombre del campo.
 * @returns {number} Longitud máxima permitida.
 */
export function getMaxLength(schema, name) {
  const field = schema.shape[name];
  return field?._def?.checks?.find(check => check.kind === "max")?.value || 500;
}
