import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Image } from "antd";
import { useState, useEffect } from "react";
import { Modal } from "antd";
import { File } from "lucide-react";
import { getDropboxSharedLink } from "@lib/api/dropboxApi";

export default function CompaniesInfo({ companyInfo, className = "", docs }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [dropboxLinks, setDropboxLinks] = useState({});

  const handleOpenModal = (content, title) => {
    setModalContent(content.toUpperCase());
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  // Filtrar documentos
  const documents = (docs || docs || []).filter(
    doc =>
      doc.tipo_archivo === "BROCHURE EMPRESA" ||
      doc.tipo_archivo === "BROCHURE PRODUCTOS"
  );

  // Obtener los shareLink de Dropbox para cada documento
  useEffect(() => {
    const fetchLinks = async () => {
      const links = {};
      await Promise.all(
        documents.map(async (doc) => {
          try {
            const { tempLink } = await getDropboxSharedLink(doc.url_documento);
            links[doc.id_documento] = tempLink;
          } catch {
            links[doc.id_documento] = null;
          }
        })
      );
      setDropboxLinks(links);
    };
    if (documents.length > 0) fetchLinks();
  }, [docs]);

  return (
    <>
      <Card className={`w-full ${className}`}>
        <h3 className="text-lg mb-4 font-semibold text-zinc-700 text-center">Información de Empresa</h3>
        <CardContent className="pt-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <Image
                  width={200}
                  className="mask mask-squircle"
                  src={
                    !companyInfo.img_empresa || companyInfo.img_empresa === "no hay imagen cargada"
                      ? "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                      : companyInfo.img_empresa
                  }
                />
              </div>
              {/* Iconos de documentos debajo de la imagen */}
              

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="font-medium">Nombre de la Empresa</div>
                <div className="md:col-span-2">{(companyInfo.empresa || "No especificado").toUpperCase()}</div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="font-medium">RIF</div>
                <div className="md:col-span-2">{(companyInfo.rif || "No especificado").toUpperCase()}</div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="font-medium">Actividades Económicas</div>
                <div
                  className="md:col-span-2 text-sm cursor-pointer"
                  onClick={() =>
                    handleOpenModal(companyInfo.economicActivities || "No especificado", "Actividad Económica")
                  }
                >
                  {((companyInfo.economicActivities || "No especificado").length > 100
                    ? (companyInfo.economicActivities || "No especificado").substring(0, 100) + "... "
                    : (companyInfo.economicActivities || "No especificado")
                  ).toUpperCase()}
                  {((companyInfo.economicActivities || "No especificado").length > 100) && (
                    <span className="text-blue-500">Ver más</span>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="font-medium">Sub Sectores Económicos</div>
                <div
                  className="md:col-span-2 text-sm cursor-pointer"
                  onClick={() =>
                    handleOpenModal(companyInfo.subEconomicSectors || "No especificado", "Subsector Económico")
                  }
                >
                  {((companyInfo.subEconomicSectors || "No especificado").length > 100
                    ? (companyInfo.subEconomicSectors || "No especificado").substring(0, 100) + "... "
                    : (companyInfo.subEconomicSectors || "No especificado")
                  ).toUpperCase()}
                  {((companyInfo.subEconomicSectors || "No especificado").length > 100) && (
                    <span className="text-blue-500">Ver más</span>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="font-medium">País</div>
                <div className="md:col-span-2">{(companyInfo.pais || "No especificado").toUpperCase()}</div>
              </div>


              
              {documents.length > 0 && (
                <>
                  <Separator />
                  <div className=" text-center font-medium mb-2 mt-4">Documentos</div>
                  <div className="flex flex-row justify-center gap-3 mt-2 bg-[#b2e713] p-4 rounded-2xl">
                    {documents.map((doc, idx) => (
                      <div key={doc.id_documento || idx} className="flex flex-col items-center">
                        <a
                          href={dropboxLinks[doc.id_documento] || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={doc.nombre || "Documento"} 
                          className="bg-primary p-2 rounded-full hover:bg-gray-300 transition-colors"
                          style={{ pointerEvents: dropboxLinks[doc.id_documento] ? "auto" : "none", opacity: dropboxLinks[doc.id_documento] ? 1 : 0.5 }}
                        >
                          <File className="text-primary" color="#fff" size={28}/>
                        </a>
                        <span className="text-xs mt-1 text-center">{doc.tipo_archivo}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        title={modalTitle}
        visible={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        <p>{modalContent}</p>
      </Modal>
    </>
  );
}