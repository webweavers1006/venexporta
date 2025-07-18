/**
 * Devuelve la URL de imagen de empresa o un placeholder si no existe.
 * @param {string} imgUrl - URL de la imagen de la empresa.
 * @returns {string} URL válida de la imagen.
 */
export function getCompanyImage(imgUrl) {
  if (!imgUrl || imgUrl === "no hay imagen cargada") {
    return "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
  }
  return imgUrl;
}
