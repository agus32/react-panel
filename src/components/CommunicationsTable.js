import React, { useEffect, useState } from 'react';
import { GetCommunications } from '../ApiHandler';
import { Table, Button, Input, Select, Form, Row, Col, Space, DatePicker,Pagination, Switch} from 'antd';


const { Option } = Select;
const { RangePicker } = DatePicker;


const filterInitialState = {
    fuentes: [],
    asesores: [],
    nombre: '',
    telefono: '',
    fechaDesde: null,
    fechaHasta: null,
    is_new: null,
  };

export const CommunicationsTable = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState(filterInitialState);


  const fetchData = async () => {
    console.log(filters);
    setLoading(true);
    const data = await GetCommunications(filters, pagination.current, pagination.pageSize);
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
  }, [pagination.current,pagination.pageSize]);

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
  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
  };

  const resetFilters = () => {
    setFilters(filterInitialState);
    setPagination({
      ...pagination,
      current: 1,
      total: 0,
    });
    fetchData();
  }

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha_lead',
      key: 'fecha_lead',
    },
    {
      title: 'Fecha extraccion',      
      dataIndex: 'fecha',
      key: 'fecha',
    },
    {
      title: 'Nuevo',
      dataIndex: 'is_new',
      key: 'is_new',
      render: (text, record) => (record.is_new ? 'Si' : 'No'),
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
        <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: 24 }}>
            <Form layout="vertical">
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="Fecha Desde y Hasta">
                            <RangePicker style={{ width: '100%' }} onChange={handleDateChange} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
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
                    </Col>
                    <Col span={8}>
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
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="Nombre">
                            <Input
                                placeholder="Nombre"
                                name="nombre"
                                value={filters.nombre}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Telefono">
                            <Input
                                placeholder="Telefono"
                                name="telefono"
                                value={filters.telefono}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Nuevo">
                            <Select
                                onChange={(value) => handleSelectChange('is_new', value)}
                                value={filters.is_new}
                                defaultValue={null}
                            >
                                <Option value={null}>Seleccione</Option>
                                <Option value={true}>Si</Option>
                                <Option value={false}>No</Option>                                
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Button type="primary" onClick={handleSearch} block>Buscar</Button>
                    </Col>
                    <Col span={8}>
                        <Button type="primary" danger onClick={resetFilters} block>Resetear filtros</Button>
                    </Col>
                </Row>
            </Form>
        </div>
        <Space style={{ marginBottom: 16 }}>
            <Button type="primary" style={{ backgroundColor: '#36cfc9', borderColor: '#36cfc9' }}>
                Send Broadcast
            </Button>
        </Space>
        <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record.id}
            loading={loading}
            pagination={false}
        />
        <Pagination
            style={{ marginTop: 10, textAlign: 'center', justifyContent: 'center' }}
            current={pagination.current}
            total={pagination.total}
            onChange={handlePageChange}
        />
    </div>
  );

};


