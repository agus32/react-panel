import React, { useEffect, useState } from 'react';
import { Table, Switch, Button} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Swal from "sweetalert2";



const exampleAsesores = [
    { nombre: "Brenda Díaz", telefono: "5213313420733", email: "b@gmail.com", activo: true },
    { nombre: "Aldo Salcido", telefono: "5213322363535", email: "a@gmail.com", activo: false },
    { nombre: "Juan Perez", telefono: "5213334567890", email: "j@gmail.com", activo: true },
    { nombre: "Maria Lopez", telefono: "5213345678901", email: "m@gmail.com", activo: false },
    { nombre: "Pedro Ramirez", telefono: "5213356789012", email: "p@gmail.com", activo: true },
  ];

export const AdvisorTable = () => {
  const [asesores, setAsesores] = useState(exampleAsesores);

  useEffect(() => {
    fetchAsesores();
  }, []);

  const fetchAsesores = async () => {
    //const response = await axios.get('/asesores');
    //setAsesores(response.data);
  };

  const toggleActivo = async (phone) => {
    //const asesor = asesores.find(a => a.phone === phone);
    //await axios.put(`/asesores/${phone}`, { ...asesor, activo: !asesor.activo });
    console.log('toggleActivo', phone);
    fetchAsesores();
  };

  const deleteAsesor = async (phone) => {
    //await axios.delete(`/asesores/${phone}`);
    console.log('deleteAsesor', phone);
    fetchAsesores();
  };

  const showDeleteConfirm = (phone) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar el asesor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAsesor(phone);
      }
    });
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Telefono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Activo',
      key: 'activo',
      render: (text, record) => (
        <Switch checked={record.activo} onChange={() => toggleActivo(record.telefono)} />
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <span>
          <Button type="primary" icon={<EditOutlined />} style={{ marginRight: 8 }} />
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record.telefono)} />
        </span>
      ),
    },
  ];

  return <Table style={{ marginTop: 16 }} dataSource={asesores} columns={columns} rowKey="telefono" />;
};


