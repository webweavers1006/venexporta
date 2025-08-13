import { useTranslation } from "react-i18next";

function LanguageSelector() {
  const { t, i18n } = useTranslation()

   const FuncionCambiarLenguaje = (leng) => {
    i18n.changeLanguage(leng);
    localStorage.setItem('idioma', leng); // opcional: persistencia
  };

  return (
    <div style={{ textAlign: 'right', padding: '1rem' }}>
      <h1>{t("MENSAJE")}</h1>
      <select
        onChange={(e) => FuncionCambiarLenguaje(e.target.value)}
        value={i18n.language}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: '2px solid #000000',
          color: '#000000',
          fontSize: '1rem',
          padding: '0.5rem',
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
        }}
      >
        <option value="es">Español</option>
        <option value="en">English</option>
        <option value="zh">中文</option>
        {/* Agrega más idiomas según sea necesario */}
      </select>
    </div>
  );
}



export default LanguageSelector;