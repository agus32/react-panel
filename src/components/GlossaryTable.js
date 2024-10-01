import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { GetGlossary, PutGlossary, DeleteGlossary, PostGlossary } from '../ApiHandler';
import { GlossaryModal } from './GlossaryModal';

export const GlossaryTable = () => {
  const [glossary, setGlossary] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlossary();
  }, []);

  const fetchGlossary = async () => {
    const response = await GetGlossary();
    const data = response?.data;
    setGlossary(data);
    setLoading(false);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setSelectedItem(record);
    setVisible(true);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setSelectedItem(null);
    setVisible(true);
  };

  const handleSave = async (item) => {
    if (isEditing) {
      const changedValues = {};

      Object.keys(item).forEach((key) => {
        if (item[key] !== selectedItem[key]) {
          changedValues[key] = item[key];
        }
      });

      if (Object.keys(changedValues).length > 0) {
        await PutGlossary(selectedItem.id, changedValues);
        fetchGlossary();
      }
    } else {
      await PostGlossary(item);
      fetchGlossary();
    }
    setVisible(false);
  };

  const showDeleteConfirm = (id) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar este término del glosario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteGlossary(id);
        fetchGlossary();
      }
    });
  };

  const columns = [
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'UTM Source',
      dataIndex: 'utm_source',
      key: 'utm_source',
    },
    {
      title: 'UTM Medium',
      dataIndex: 'utm_medium',
      key: 'utm_medium',
    },
    {
      title: 'UTM Channel',
      dataIndex: 'utm_channel',
      key: 'utm_channel',
    },
    {
      title: 'UTM Campaign',
      dataIndex: 'utm_campaign',
      key: 'utm_campaign',
    },
    {
      title: 'UTM Ad',
      dataIndex: 'utm_ad',
      key: 'utm_ad',
    },    
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
          />
        </span>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" style={{ marginTop: 16 }} onClick={handleAddNew}>
        Nuevo UTM
      </Button>
      <Table
        style={{ marginTop: 5 }}
        dataSource={glossary}
        columns={columns}
        rowKey="id"
        pagination={{ position: ['bottomCenter'] }}
        loading={loading}
      />
      <GlossaryModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSave={handleSave}
        initialValues={selectedItem}
        isEditing={isEditing}
      />
    </>
  );
};
