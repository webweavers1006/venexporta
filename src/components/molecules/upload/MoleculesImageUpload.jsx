import { useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadImages } from '@lib/api/apiIndex';

//✅Components traduction
import { useTranslation } from "react-i18next";

// Utilidad para convertir un archivo a Base64
const toBase64 = (file) => new Promise((resolve, reject) => {
  
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

// Validar archivo antes de subir
const validateFile = (file, fileType, fileNameType, setError) => {
  setError(false);
  const isValidType = fileType.includes(file.type);
  const isValidSize = (file.size / 1024 / 1024) <= 10;

  if (!isValidType) {
    console.log(`El archivo cargado no está en el formato ${fileNameType}`);
    setError(true);
  }
  if (!isValidSize) {
    console.log(t("imageUpload.invalidSize"));
    setError(true);
  }

  return isValidType && isValidSize;
};

const ImageUpload = ({ companyId, fileType, fileNameType, fileNumber, onImageChange, color, sendImage, title }) => {
  // Traducción
  const { t } = useTranslation();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState(false);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await toBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => {
    if (!error) {
      setFileList(newFileList);
      if (onImageChange) {
        const image = newFileList.length > 0 ? newFileList[0].originFileObj : null;
        onImageChange(image);
      }
    }
  };

  const handleUpload = async () => {
    try {
      await uploadImages(fileList, companyId);
      message.success(t("imageUpload.success"));
      setFileList([]);
    } catch (error) {
      message.error(t("imageUpload.uploadError"));
    }
  };

  const beforeUpload = async (file, onSuccess) => {
    setError(false)
    const typeFile = file.type
    const types = fileType.filter(type=> type === typeFile)
    const isLt2M = (file.size / 1024 / 1024) <= 10;
    if (types.length===0) {
      setError(true)
      message.error('El archivo cargado no esta en el formato '+fileNameType)
    }
    if (!isLt2M) {
      setError(true)
      message.error(t("imageUpload.invalidSize"))
    } 
    if (sendImage) {
      try {
        await uploadImages([file], companyId);
        message.success(t("imageUpload.success"));
        setFileList([]);
      } catch (error) {
        message.error(t("imageUpload.uploadError"));
      } 
    } 
    onSuccess(await toBase64(file));
    return true;
  };

  const uploadButton = (
    <div>
      <PlusOutlined style={{ fontSize: 20, color: color}} />
      <div style={{ marginTop: 8, color: color}}>{title?title: t("imageUpload.button")}</div>
    </div>
  );

  return (
    <div className="box">
      <Upload
        action={handleUpload}
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
      >
        {fileList.length >= fileNumber ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default ImageUpload;
