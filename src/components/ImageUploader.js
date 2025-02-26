import { useState } from "react";
import { Input, message,Modal } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";


export const ImageUploader = () => {
  const [images, setImages] = useState([
    { url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" }, // Ejemplo inicial
  ]);
  const [imageUrl, setImageUrl] = useState("");
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const handleUrlUpload = () => {
    if (!imageUrl.trim()) return;

    // Validar si la URL es una imagen
    if (!imageUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      message.error("Por favor ingresa una URL válida de imagen.");
      return;
    }

    // Agregar nueva imagen al estado manteniendo el formato
    setImages([...images, { url: imageUrl }]);
    setImageUrl("");
    message.success("Imagen agregada desde URL");
  };

  const handleRemove = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Campo para ingresar URL */}
      <Modal 
        style={{ marginBottom: 10, display: "flex", gap: 8 }}
        isVisible={modalIsVisible}
        onCancel={() => setModalIsVisible(false)}
      >
        <Input
          placeholder="Pegar URL de imagen"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          onPressEnter={handleUrlUpload}
          style={{ flex: 1 }}
        />
        <button onClick={handleUrlUpload} disabled={!imageUrl.trim()}>
          Agregar
        </button>
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

        {/* Botón de agregar más imágenes */}
        {images.length < 8 && (
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
        )}
      </div>
    </div>
  );
};

