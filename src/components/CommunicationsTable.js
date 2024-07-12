import React, { useEffect, useState } from 'react';
import { GetCommunications } from '../ApiHandler';
import { Table, Button, Input, Select, Form, Row, Col, Space, DatePicker,Pagination } from 'antd';


const { Option } = Select;
const { RangePicker } = DatePicker;


const filterInitialState = {
    fuentes: [],
    asesores: [],
    nombre: '',
    telefono: '',
    fechaDesde: null,
    fechaHasta: null,
  };

export const CommunicationsTable = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
  });
  const [filters, setFilters] = useState(filterInitialState);


  const fetchData = async () => {
    setLoading(true);
    const data = await GetCommunications(filters, pagination.current);
    if (Array.isArray(data.data)) {
      setFilteredData(data.data);
      setPagination({
        ...pagination,
        total: data.pagination.total, 
      });
    } else {
      console.error("Fetched data is not an array:", data.data);
      setFilteredData([]);
    }
    setLoading(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
  }, [pagination.current]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSelectChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleDateChange = (dates) => {
    setFilters({
      ...filters,
      fechaDesde: dates ? dates[0] : null,
      fechaHasta: dates ? dates[1] : null
    });
  };

  const handleSearch = () => { 
    setPagination({
      ...pagination,
      current: 1, 
    });
    fetchData();
  };
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  };

  const resetFilters = () => {
    setFilters(filterInitialState);
    setPagination({
      current: 1,
      total: 0,
    });
    fetchData();
  }

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
    {
      title: 'Fecha extraccion',
      dataIndex: 'fecha_lead',
      key: 'fecha_lead',
    },
    {
      title: 'Asesor',
      dataIndex: ['asesor', 'name'],
      key: 'asesor.name',
    },
    {
      title: 'Fuente',
      dataIndex: 'fuente',
      key: 'fuente',
    },
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
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h3>Filtrar</h3>
            <Form layout="vertical">
              <Form.Item label="Fecha Desde y Hasta">
                <RangePicker onChange={handleDateChange} />
              </Form.Item>
              <Form.Item label="Fuente">
                <Select
                  mode="multiple"
                  placeholder="Seleccione fuentes"
                  onChange={(value) => handleSelectChange('fuentes', value)}
                  value={filters.fuentes}
                >
                  <Option value="Propiedades">Propiedades</Option>
                  <Option value="Whatsapp">Whatsapp</Option>
                  <Option value="ivr">IVR</Option>
                  <Option value="lamudi">Lamudi</Option>
                  <Option value="inmuebles24">Inmuebles24</Option>
                  <Option value="casasyterrenos">Casas y Terrenos</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Asesor">
                <Select
                  mode="multiple"
                  placeholder="Seleccione asesores"
                  onChange={(value) => handleSelectChange('asesores', value)}
                  value={filters.asesores}
                >
                  <Option value="Onder Sotomayor">Onder Sotomayor</Option>
                  <Option value="Eduardo Jordan">Eduardo Jordan</Option>
                  <Option value="Brenda Díaz">Brenda Díaz</Option>
                  <Option value="Maggie Escobedo">Maggie Escobedo</Option>
                  <Option value="Lucy Vera">Lucy Vera</Option>
                  <Option value="Aldo Salcido">Aldo Salcido</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Nombre">
                <Input
                  placeholder="Nombre"
                  name="nombre"
                  value={filters.nombre}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item label="Telefono">
                <Input
                  placeholder="Telefono"
                  name="telefono"
                  value={filters.telefono}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleSearch} block>Buscar</Button>
                <Button style={{ marginTop: 5}} type="primary" danger onClick={resetFilters}block>Resetear filtros</Button>                     
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={18}>
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" style={{ backgroundColor: '#36cfc9', borderColor: '#36cfc9' }}>
              Send Broadcast
            </Button>
          </Space>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record.key}
            loading={loading}
            pagination={false}
          />
          <Pagination
            style={{ marginTop: 10, textAlign: 'center',justifyContent: 'center'}}
            current={pagination.current}
            total={pagination.total}
            onChange={handlePageChange}
          />
        </Col>
      </Row>
    </div>
  );
};


