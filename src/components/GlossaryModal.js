import React, { useEffect } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import Swal from "sweetalert2";

export const GlossaryModal = ({ visible, onClose, onSave, initialValues, isEditing }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue(initialValues);
    }
  }, [visible, form, initialValues]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
        form.resetFields();
        onClose();
      })
      .catch((info) => {
        Swal.fire({
          title: "Advertencia",
          text: "Por favor complete los campos requeridos",
          icon: "warning",
        });
      });
  };

  return (
    <Modal
      open={visible}
      title={isEditing ? 'Editar UTM' : 'Nuevo UTM'}
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
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="code"
          label="Código"
          rules={[{required: true, message: 'Ingrese código' }]}
        >
          <Input disabled={isEditing}/>
        </Form.Item>
        <Form.Item
          name="utm_source"
          label="UTM Source"
          rules={[{ required: false, message: 'Ingrese UTM Source' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="utm_medium"
          label="UTM Medium"
          rules={[{ required: false, message: 'Ingrese UTM Medium' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="utm_channel"
          label="UTM Channel"
          rules={[{ required: true, message: 'Ingrese UTM Channel' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="utm_campaign"
          label="UTM Campaign"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="utm_ad"
          label="UTM Ad"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
