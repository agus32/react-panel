// GeneradorCotizacion.tsx
import React, { useState,useEffect } from "react";
import { Form,Input,Button,Alert,Spin,Typography,Space, Select} from "antd";
import {GetAdvisors,PostCotizacion} from "../ApiHandler";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const Cotizacion = () => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [advisors, setAdvisors] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    GetAdvisors().then((response) => {
      setAdvisors(response?.data);
    });
  }, []);

  const onFinish = async(values) => {
    const { cliente, telefonoAsesor, urls } = values;
    const asesor = advisors.find(advisor => advisor.phone === telefonoAsesor);
    setLoading(true);
    setStatusMessage("Generando cotización...");
    const response = await PostCotizacion(cliente,asesor,urls);
    setLoading(false);
    if(response.success){
      setStatusMessage("Cotización generada con éxito.");
      form.resetFields();
    }else{
      setStatusMessage("Error al generar la cotización.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <Title level={2}>Generador de cotizaciones</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Nombre del cliente"
          name="cliente"
          rules={[{ required: true, message: "Por favor ingrese el nombre del cliente." }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Nombre del asesor"
          name="telefonoAsesor"
          rules={[{ required: true, message: "Por favor elija un asesor." }]}
        >
          <Select>
            {advisors.map((advisor) => (
              <Select.Option key={advisor.phone} value={advisor.phone}>
                {advisor.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Lista de URLs (una por línea)"
          name="urls"
          rules={[{ required: true, message: "Por favor ingrese al menos una URL." }]}
        >
          <TextArea rows={6} placeholder="http://ejemplo1.com&#10;http://ejemplo2.com" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block disabled={loading}>
            Generar Cotización
          </Button>
        </Form.Item>
      </Form>

      {loading && (
        <Space direction="horizontal" align="center">
          <Spin size="large" />{" "}
          <Text>Cargando...</Text>
        </Space>
      )}

      {statusMessage && !loading && (
        <Alert
          message={statusMessage}
          type="success"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

