import { useState } from "react";
import { Input, message,Modal,Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";


export const ImageUploader = ({images,setImages,isEditing,deleteImage,addImage}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const handleUrlUpload = async () => {
    if (!imageUrl.trim()) return;

    // Validar si la URL es una imagen
    if (!imageUrl.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i)) {
      message.error("Por favor ingresa una URL válida de imagen.");
      return;
    }
    if(isEditing){
      const respose = await addImage(imageUrl);
      if (!respose) {
        message.error("Error al agregar imagen desde URL");
        return;
      }

    }
    !isEditing && setImages([...images, { url: imageUrl }]);
    setImageUrl("");
    message.success("Imagen agregada desde URL");
    setModalIsVisible(false);
  };

  const handleRemove = async (index) => {
    if(isEditing){
      const img = images[index];
      const response = await deleteImage(img?.id);
      if (!response) {
        message.error("Error al eliminar imagen");
        return;
      }
    }
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div style={{marginTop:10,marginBottom:20}}>
      {/* Campo para ingresar URL */}
      <Modal 
        open={modalIsVisible}
        title={"Importar desde URL"}
        onCancel={() => setModalIsVisible(false)}
        onOk={handleUrlUpload}
        footer={[
          <Button key="back" onClick={() => setModalIsVisible(false)}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" disabled={!imageUrl.trim()} onClick={handleUrlUpload}>
            Agregar
          </Button>,
        ]}
      >
        <Input
          placeholder="Pegar URL de imagen"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          onPressEnter={handleUrlUpload} 
        />
      </Modal>

      {/* Galería de imágenes */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              width: 100,
              height: 100,
              position: "relative",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            <img
              src={image.url}
              alt="uploaded"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <DeleteOutlined
              onClick={() => handleRemove(index)}
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                borderRadius: "50%",
                padding: 5,
                cursor: "pointer",
                fontSize: 14,
              }}
            />
          </div>
        ))}
        <div
          onClick={() => setModalIsVisible(true)}
          style={{
            width: 100,
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #ccc",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          <PlusOutlined style={{ fontSize: 24, color: "#aaa" }} />
        </div>
      </div>
    </div>
  );
};

