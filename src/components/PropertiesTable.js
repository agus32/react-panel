import React,{useState,useEffect} from 'react';
import { Table, Button, Space, Input,Tag } from 'antd';
import { GetProperties,DeleteProperty,PostCSV } from '../ApiHandler';
import { useNavigate } from 'react-router-dom';
import {ShareAltOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import { PublishModal } from './PublishModal';
import Swal from 'sweetalert2';





export const PropertiesTable = () => {
  const [properties, setProperties] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [propertyIds, setPropertyIds] = useState([]);
  const [isPublishing, setIsPublishing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleUnicPublishModal = (id) => {
    setIsPublishing(true);
    setPropertyIds([id]);  
    setIsModalVisible(true);
  }
  const handlePublishModal = () => {
    setIsPublishing(true);
    setIsModalVisible(true);
  }
  const handleUnpublishModal = () => {
    setIsPublishing(false);
    setIsModalVisible(true);
  }

  const handleImportCSV = async () => {
      const { value: file } = await Swal.fire({
        title: "Importar CSV",
        text: "Seleccione un archivo CSV",
        input: "file",
        inputAttributes: {
          accept: ".csv",
        },
        showCancelButton: true,
        confirmButtonText: "Subir",
        cancelButtonText: "Cancelar",
      });
    
      if (file) {
        await PostCSV(file,"properties/csv");
      } else {
        Swal.fire({
          icon: "info",
          title: "Cancelado",
          text: "No se seleccionó ningún archivo.",
        });
      }
    };

  useEffect(() => {
    const filtProperties = properties.filter((property) => property?.title.toLowerCase().includes(searchName.toLowerCase()));
    setFilteredProperties(filtProperties);
  }, [searchName,properties]);


  const fetchProperties = async () => {
    const flw = await GetProperties();
    const data = flw?.data;
    const propertiesArray = data ? Object.values(data) : [];
    setProperties(propertiesArray);
    setFilteredProperties(propertiesArray);
  };

  const handleDelete = async (uuid) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this property!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await DeleteProperty(uuid);
        fetchProperties();
      }
    });
    
  }
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setPropertyIds(selectedRowKeys);
    },
  };


  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (text.length > 120 ? `${text.substring(0, 120)}...` : text),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Portals',
      key: 'type',
      render: (record) => (
        <Tag color='success'> {record.type} </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record,index) => (
        <Space size="small" key={index}>
          <Button color="default" variant="text" onClick={() => handleUnicPublishModal(record.id)}><ShareAltOutlined /></Button>
          <Button color="default" variant="text" onClick={() => navigate(`/propiedades/nueva/?edit=${record.id}`)}><EditOutlined /></Button>
          <Button color="default" variant="text" danger disabled={record.is_main} onClick={() => handleDelete(record.id)}><DeleteOutlined /></Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2 style={{ marginTop: 16 }}>Properties</h2>
      <PublishModal isVisible={isModalVisible} propertyIds={propertyIds} onClose={() => setIsModalVisible(false)} isPublishing={isPublishing}/>
      <Input.Search allowClear placeholder="Search by title" onChange={(e) => setSearchName(e.target.value)} style={{marginBottom: 20 }}/>
      <div style={{marginBottom: 5 , display: 'flex', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', gap: 5}}>
        <Button type="primary"  disabled={propertyIds.length < 2} onClick={handlePublishModal}>Publish Selected</Button>
        <Button type="primary" danger disabled={propertyIds.length < 1} onClick={handleUnpublishModal}>Unpublish Selected</Button>
      </div>
      <Button type="primary" onClick={handleImportCSV}>Import CSV</Button>
      </div>
      <Table
        columns={columns}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        dataSource={filteredProperties}
        rowKey={(record) => record.id}
        pagination={{ position: ['bottomCenter'] }}
      />
    </>
  );
};
