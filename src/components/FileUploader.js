import React,{useState} from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload,List } from 'antd';

const { Dragger } = Upload;

const UPLOAD_URL = 'https://graph.facebook.com/v21.0/193151663891728/media';

export const FileUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('messaging_product', 'whatsapp');
    formData.append('type', 'image'); 

    try {
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer EAAbDrjrkX5IBO1rbBqzz5SnpHLENnMTOY45DN7Y39gSRyrLxcfQmyBNE8ShQHMUTOtXnaZBZAWtrA6Scx6H6cdQCZAMSPsj3KVJBcExm3jFyeROA3FRwPGn08GFNkZA8ZCPIMy8BOPZCOUSv4Ou66PtVscYts0kAe5UsjVe9ufSw2Kywv8XdrZBpbumdUmflcvB`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        message.success(`${file.name} se ha subido correctamente. ID: ${result.id}`);

        setUploadedFiles(prevFiles => [
            ...prevFiles,
            { id: result.id, name: file.name }
          ]);

        onSuccess(result);
      } else {
        message.error(`Error al subir ${file.name}: ${result.error.message}`);
        onError(result.error);
      }
    } catch (error) {
      message.error(`Error al subir ${file.name}`);
      onError(error);
    }
  };

  return (
    <div style={{marginTop: '30px',textAlign: 'center'}}>
      <h1>Subir Media</h1>
      <Dragger customRequest={handleRequest} style={{marginTop: '40px'}}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Haz clic o arrastra el archivo a esta área para subirlo
        </p>
        <p className="ant-upload-hint">
          Soporte para carga simple o múltiple.
        </p>
      </Dragger>
      {uploadedFiles.length > 0 &&
      <>
      <h2 style={{marginTop: '40px'}}>Archivos subidos</h2>
      <List
        bordered
        dataSource={uploadedFiles}
        renderItem={(file) => (
          <List.Item>
            {file.name} - <strong>ID:</strong> {file.id}
          </List.Item>
        )}
        className="mt-4"
      /></>}
    </div>
  );
};

export default FileUploader;
