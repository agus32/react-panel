import React, {useState,useEffect } from "react";
import { Form, Input, InputNumber, Select, DatePicker, Button } from "antd";
import {GetOneProperty,PostProperty,PutProperty,DeletePropertyImage,PostPropertyImage} from '../ApiHandler';
import { useSearchParams,useNavigate } from 'react-router-dom';
import {ImageUploader} from './ImageUploader';
import { MapPicker } from "./MapPicker";
import dayjs from 'dayjs';


const { Option } = Select;

export const PropertyForm = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [idEdit, setIdEdit] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [images,setImages] = useState([]);
  const [ubication,setUbication] = useState({
    address: "",
    location: {
      lat: 24,
      lng: -103.5
    }
  });

  useEffect(() => {
    const editID = searchParams.get('edit');
    if (editID) {
      setIdEdit(editID);
      const fetchProperty = async () => {
        const data = await GetOneProperty(editID);
        const property = data?.data;
        form.setFieldsValue({
          ...property,
          updated_at: property.updated_at ? dayjs(property.updated_at) : null,
          created_at: property.created_at ? dayjs(property.created_at) : null,
        });
        property.images && setImages(property.images);
        property.ubication && setUbication(property.ubication);
      };
      fetchProperty();
      setIsEditing(true);
    }// eslint-disable-next-line
  }, []);

  const deleteImage = async(id) => {
    const response = await DeletePropertyImage(idEdit,id);
    return response?.success
  }

  const addImage = async(imageUrl) => {
    const response = await PostPropertyImage(idEdit,[{ url: imageUrl }]);
    response?.success && setImages([...images,response?.data[0]]);
    return response?.success
  }

  const onFinish = async (values) => {
    const prop = {...values,images,ubication};
    if(isEditing){
      const response = await PutProperty(idEdit,prop);
      response.success && navigate('/propiedades');
    }
    else{
      const response = await PostProperty(prop);
      response.success && form.resetFields() && setImages([]);
    }
  };

  return (
    <div
      style={{
        margin: "auto",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
        {isEditing ? "Editar Propiedad" :"Agregar Propiedad"}
      </h2>
      <Form  form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Título"
          name="title"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Input placeholder="Ingrese el título" style={{ width: "100%" }} />
        </Form.Item>

        {/* Precio y Moneda en una fila */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Form.Item
            label="Precio"
            name="price"
            rules={[{ required: true, message: "Campo obligatorio" }]}
            style={{ flex: 1 }}
          >
            <Input style={{ width: "100%" }}  placeholder="Ingrese el precio" />
          </Form.Item>

          <Form.Item
            label="Moneda"
            name="currency"
            rules={[{ required: true, message: "Campo obligatorio" }]}
            style={{ flex: 1 }}
          >
            <Select placeholder="Seleccione moneda" style={{ width: "40%" }}>
              <Option value="MXN">MXN</Option>
              <Option value="USD">USD</Option>
              <Option value="EUR">EUR</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item label="Descripción" name="description" rules={[{ required: true, message: "Campo obligatorio" }]}>
          <Input.TextArea rows={3} placeholder="Ingrese una descripción" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Tipo"
          name="type"
          rules={[{ required: true }]}
        >
          <Select placeholder="Seleccione el tipo" style={{ width: "100%" }}>
            <Option value="house">Casa</Option>
            <Option value="apartment">Apartamento</Option>
            <Option value="land">Terreno</Option>
          </Select>
        </Form.Item>

        {/* Sección de Características en dos columnas */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <Form.Item label="Antigüedad (Años)" name="antiquity" style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item label="Cocheras" name="parkinglots" style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item label="Baños" name="bathrooms" style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item label="Habitaciones" name="rooms" style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item label="Medio baño" name="half_bathrooms" style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </div>

        <Form.Item
          label="Operación"
          name="operation_type"
          rules={[{ required: true }]}
        >
          <Select placeholder="Seleccione operación" style={{ width: "100%" }}>
            <Option value="sell">Venta</Option>
            <Option value="rent">Renta</Option>
            <Option value="vacation">Vacacional</Option>
          </Select>
        </Form.Item>

        {/* Superficies en dos columnas */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Form.Item label="Superficie Total (m²)" name="m2_total" style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item label="Superficie Cubierta (m²)" name="m2_covered" style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
        </div>
        
        <MapPicker isEditing={isEditing} ubication={ubication} setUbication={setUbication}/>
        
        <Form.Item label="URL del Video" name="video_url">
          <Input placeholder="Ingrese la URL del video" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="URL del Recorrido Virtual" name="virtual_route_url">
          <Input placeholder="Ingrese la URL del recorrido" style={{ width: "100%" }} />
        </Form.Item>

        {/* Fechas en dos columnas */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Form.Item label="Última Actualización" name="updated_at" style={{ flex: 1 }}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Fecha de Creación" name="created_at" style={{ flex: 1 }}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <div>
          <label>Imágenes</label>
          <ImageUploader images={images} setImages={setImages} isEditing={isEditing} deleteImage={deleteImage} addImage={addImage}/>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: "100%",
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              height: "40px",
            }}
          >
            Guardar Propiedad
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
