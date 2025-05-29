import { Modal, Input, Divider, Typography, Space } from 'antd';

const { Text } = Typography;

export const MessageModal = ({ modalInfo, onClose }) => {
  const { isVisible, data } = modalInfo;
  const { message, utm, fecha, is_new, asesor, fuente, nombre, telefono, email } = data;

  const fields = [
    { label: 'Fecha', value: fecha },
    { label: 'Nuevo Cliente', value: is_new ? 'Sí' : 'No' },
    { label: 'Asesor', value: asesor?.name },
    { label: 'Fuente', value: fuente },
    { label: 'Nombre', value: nombre },
    { label: 'Teléfono', value: telefono },
    { label: 'Email', value: email },
  ];

  return (
    <Modal
      title="Información Detallada"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      width={"60%"}
      style={{ borderRadius: 12 }}
    >
      
      {message && (
        <>
          <Divider />
          <Text strong style={{ fontSize: '16px' }}>Mensaje: </Text>
          <Text style={{ fontSize: '16px' }}>{message}</Text>
        </>
      )}

      <Divider />

      <Space direction="vertical" style={{ width: '100%' }}>
        {fields.map(({ label, value }) =>
          value ? (
            <div key={label}>
              <Text type="secondary">{label}</Text>
              <Input value={value} readOnly style={{ borderRadius: '8px' }} />
            </div>
          ) : null
        )}
      </Space>

      {utm && Object.entries(utm).some(([_, value]) => value) && (
        <>
          <Divider />
          <Text strong>UTM Data</Text>
          <Space direction="vertical" style={{ width: '100%' }}>
            {Object.entries(utm).map(([key, value]) =>
              value ? (
                <div key={key}>
                  <Text type="secondary">{key}</Text>
                  <Input value={value} readOnly style={{ borderRadius: '8px' }} />
                </div>
              ) : null
            )}
          </Space>
        </>
      )}
    </Modal>
  );
};