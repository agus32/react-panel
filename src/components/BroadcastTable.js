import React, { useEffect, useState } from 'react';
import { GetCommunications,GetFlows } from '../ApiHandler';
import { Table, Button, Input, Select, Form, Row, Col, DatePicker,Pagination} from 'antd';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

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

export const BroadcastTable = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState(filterInitialState);
  const [flows , setFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchData = async (current = null,pageSize=null,filt=null) => {
    setLoading(true);
    const data = await GetCommunications(filt ?? filters, current ?? pagination.current, pageSize ?? pagination.pageSize);
    if (Array.isArray(data.data)) {
      setFilteredData(data.data);
      setPagination({
        current: data.pagination.page,
        total: data.pagination.total,
        pageSize: data.pagination.page_size 
      });
    } else {
      console.error("Fetched data is not an array:", data.data);
      setFilteredData([]);
    }
    setLoading(false);
  };



  useEffect(() => {

    const fetchFlows = async () => {
        const flw = await GetFlows();
        const data = flw?.data;
        const flowsKeys = data ? Object.keys(data) : [];
        setFlows(flowsKeys);
      };
    fetchFlows();
    setSelectedFlow(searchParams.get('flow') ?? "");
    if(searchParams.get('filters')){
      const filt = JSON.parse(searchParams.get('filters'));
      const parsedFilters = {
        ...filt,
        fechaDesde: filt.fechaDesde ? dayjs(filt.fechaDesde) : null,
        fechaHasta: filt.fechaHasta ? dayjs(filt.fechaHasta) : null
      };
      setFilters(parsedFilters);
      fetchData(1,10,filt);
    }else fetchData();
    
    
    }, []);


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
    fetchData(1);
  };
  const handlePageChange = (page, pageSize) => {
    fetchData(page, pageSize);
  };

  const resetFilters = () => {
    setFilters(filterInitialState);
    fetchData(1,10,filterInitialState);
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
                            <RangePicker style={{ width: '100%' }} onChange={handleDateChange} 
                            value={[filters.fechaDesde ? dayjs(filters.fechaDesde) : undefined,
                                    filters.fechaHasta ? dayjs(filters.fechaHasta) : undefined]}
                            />
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
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '20px', marginTop:20}}>
            <Select
                onChange={(value) => setSelectedFlow(value)}
                value={selectedFlow}
                defaultValue={""}
                style={{ flex: 1 }}
            >
                <Option value={""}>Seleccione Flow</Option>
                {flows.map(uuid => (
                    <Option key={uuid} value={uuid}>
                    {uuid}
                    </Option>
                ))}                                
            </Select>
            <Button type="primary" style={{ backgroundColor: '#0ca789', borderColor: '#0ca789', whiteSpace: 'nowrap',flex:0.7 }}>
                Send Broadcast
            </Button>
        </div>
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


