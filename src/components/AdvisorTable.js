import React, { useEffect, useState } from 'react';
import { Table, Switch, Button} from 'antd';
import { EditOutlined, DeleteOutlined,RetweetOutlined} from '@ant-design/icons';
import Swal from "sweetalert2";
import { ReasignAdvisor,GetAdvisors,toggleAdvisorActive,DeleteAdvisor,PutAdvisor,AddAdvisor} from '../ApiHandler';
import { AdvisorModal } from './AdvisorModal';


export const AdvisorTable = () => {
  const [advisors, setAdvisors] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAdvisors();
  }, []);


  const fetchAdvisors = async () => {
    const adv = await GetAdvisors();
    const data = adv?.data;
    setAdvisors(data);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setSelectedContact(record);
    setVisible(true)
  };

  const handleAddNew = () => { 
    setIsEditing(false);
    setSelectedContact(null);
    setVisible(true)
  };

  const handleSave = async(contact) => {
    
    if (isEditing) {

      const changedValues = {};

      Object.keys(contact).forEach(key => {
        if (contact[key] !== selectedContact[key]) {
          changedValues[key] = contact[key];
        }
      });

      if (Object.keys(changedValues).length > 0) {
        await PutAdvisor(selectedContact.phone, changedValues);
        fetchAdvisors();
      }
      
    } else {
      await AddAdvisor(contact);
      fetchAdvisors();
    }
    setVisible(false);
  };


  const toggleActive = async (phone,value) => {
    toggleAdvisorActive(phone, value);
    fetchAdvisors();
  };


  const handleReasign = (phone) => {
    Swal.fire({
      title: '¿Estás seguro de reasignar el asesor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, reasignar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        ReasignAdvisor(phone);
      }
    }
    );
  };


  const showDeleteConfirm = (phone) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar el asesor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteAdvisor(phone);
        fetchAdvisors();
      }
    });
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Telefono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Activo',
      key: 'active',
      render: (text, record) => (
        <Switch checked={record.active} onChange={() => toggleActive(record.phone,!record.active)} />
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <span>
          <Button type="primary" icon={<EditOutlined />} style={{ marginRight: 8 }} onClick={() => handleEdit(record)} />
          <Button type="primary" danger icon={<DeleteOutlined />} style={{ marginRight: 8 }} onClick={() => showDeleteConfirm(record.phone)} />
          <Button type="primary" icon={<RetweetOutlined />} style={{ backgroundColor: '#008000', borderColor: '#008000'}} onClick={() => handleReasign(record.phone)}/>
        </span>
      ),
    },
  ];

  return (
  <>
    <Button type="primary" style={{ marginTop: 16 }} onClick={handleAddNew}>Agregar nuevo asesor</Button>
    <Table style={{ marginTop: 5 }} dataSource={advisors} columns={columns} rowKey="phone" pagination={{ position: ['bottomCenter'] }}/>
    <AdvisorModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSave={handleSave}
        initialValues={selectedContact}
        title={isEditing ? "Editar Asesor" : "Nuevo Asesor"}
      />
  </>
  );
};


