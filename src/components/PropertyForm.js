import React from "react";
import { Form, Input, InputNumber, Select, DatePicker, Button } from "antd";

const { Option } = Select;

export const PropertyForm = () => {
  const onFinish = (values) => {
    console.log("Valores del formulario:", values);
  };

  return (
    <div >
      <h2 className="text-xl font-semibold mb-4">Agregar Propiedad</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Título" name="title" rules={[{ required: true, message: "Campo obligatorio" }]}> 
          <Input placeholder="Ingrese el título" />
        </Form.Item>

        <Form.Item label="Precio" name="price" rules={[{ required: true, message: "Campo obligatorio" }]}> 
          <InputNumber className="w-full" min={1} placeholder="Ingrese el precio" />
        </Form.Item>

        <Form.Item label="Moneda" name="currency" rules={[{ required: true, message: "Campo obligatorio" }]}> 
          <Input placeholder="Ejemplo: USD, EUR" />
        </Form.Item>

        <Form.Item label="Descripción" name="description"> 
          <Input.TextArea rows={4} placeholder="Ingrese una descripción" />
        </Form.Item>

        <Form.Item label="Tipo" name="type" rules={[{ required: true }]}> 
          <Select placeholder="Seleccione el tipo">
            <Option value="house">Casa</Option>
            <Option value="apartment">Apartamento</Option>
            <Option value="land">Terreno</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Antigüedad (Años)" name="antiquity"> 
          <InputNumber className="w-full" min={0} controls />
        </Form.Item>

        <Form.Item label="Cocheras" name="parkinglots"> 
          <InputNumber className="w-full" min={0} controls />
        </Form.Item>

        <Form.Item label="Baños" name="bathrooms"> 
          <InputNumber className="w-full" min={0} controls />
        </Form.Item>

        <Form.Item label="Habitaciones" name="rooms"> 
          <InputNumber className="w-full" min={0} controls />
        </Form.Item>

        <Form.Item label="Medio baño" name="half_bathrooms"> 
          <InputNumber className="w-full" min={0} controls />
        </Form.Item>

        <Form.Item label="Operación" name="operation_type" rules={[{ required: true }]}> 
          <Select placeholder="Seleccione operación">
            <Option value="sale">Venta</Option>
            <Option value="rent">Renta</Option>
            <Option value="vacation">Vacacional</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Superficie Total (m²)" name="m2_total"> 
          <InputNumber className="w-full" min={1} controls />
        </Form.Item>

        <Form.Item label="Superficie Cubierta (m²)" name="m2_covered"> 
          <InputNumber className="w-full" min={1} controls />
        </Form.Item>

        <Form.Item label="URL del Video" name="video_url"> 
          <Input placeholder="Ingrese la URL del video" />
        </Form.Item>

        <Form.Item label="URL del Recorrido Virtual" name="virtual_route_url"> 
          <Input placeholder="Ingrese la URL del recorrido" />
        </Form.Item>

        <Form.Item label="Última Actualización" name="updated_at"> 
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item label="Fecha de Creación" name="created_at"> 
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">Guardar Propiedad</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
