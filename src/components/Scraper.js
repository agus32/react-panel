import { Form, Input, Select, Button } from 'antd';
import { PostScraper } from '../ApiHandler';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const { TextArea } = Input;

export const Scraper = () => {
  // Estado para manejar los valores de los campos
  const [portal, setPortal] = useState('propiedades');
  const [mensaje, setMensaje] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if(url.trim() === "" || mensaje.trim() === ""){
      Swal.fire({
        title: "Advertencia",
        text: "Por favor, llena todos los campos.",
        icon: "warning",
      });
      return;
    }
    PostScraper(portal, mensaje, url);
  };


  const handlePortalChange = (value) => setPortal(value);

  const handleMensajeChange = (e) => setMensaje(e.target.value);

  const handleUrlChange = (e) => setUrl(e.target.value);

    
  return (
    <div style={{ padding: '20px' }}>
      <Form layout="vertical">
        <Form.Item
          name="portal"
          label="Selecciona el portal:"
        >
          <Select value={portal} onChange={handlePortalChange} defaultValue="propiedades">
            <Select.Option value="propiedades">Propiedades</Select.Option>
            <Select.Option value="casasyterrenos">Casasyterrenos</Select.Option>
            <Select.Option value="lamudi">Lamudi</Select.Option>
            <Select.Option value="inmuebles24">Inmuebles24</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="mensaje"
          label="Mensaje a enviar:"         
        >
          <TextArea value={mensaje} onChange={handleMensajeChange} rows={4} />
        </Form.Item>

        {portal === "propiedades" || portal === "lamudi" ? 
        <Form.Item
          name="url"
          label="URL:"
        >
          <Input value={url} onChange={handleUrlChange} />
        </Form.Item>
        : 
        <Form.Item
          name="filters"
          label="Filtros:"
        >
          <TextArea value={url} onChange={handleUrlChange} rows={4} />
        </Form.Item>
        }

        <Form.Item label={null}>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};