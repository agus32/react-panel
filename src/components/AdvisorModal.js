import React,{useEffect} from 'react';
import { Modal, Button, Form, Input } from 'antd';


export const AdvisorModal = ({ visible, onClose, onSave, initialValues, title }) => {
  const [form] = Form.useForm();
  

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue(initialValues);
    }
  }, [visible, form,initialValues]);

  const handleSave = () => {
    form
      .validateFields()
      .then(values => {
        onSave(values);
        form.resetFields();
        onClose();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      open={visible}
      title={title}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          Guardar
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Nombre"
          rules={[{ required: true, message: 'Ingrese nombre' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Teléfono"
          rules={[{ required: true, message: 'Ingrese número de teléfono' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Ingrese mail' }, { type: 'email', message: 'Por favor ingrese mail válido' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};