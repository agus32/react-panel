import React, { useEffect, useState } from 'react';
import { GetCommunications,GetGlossary,GetAdvisors,PostCSV } from '../ApiHandler';
import { Table, Button, Input, Select, Form, Row, Col, Space, DatePicker,Pagination} from 'antd';
import { useNavigate } from 'react-router-dom';
import { exportTableToCSV } from './CsvHandler';
import Swal from "sweetalert2";

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
  utm_source: [],
  utm_medium: [],
  utm_channel: [],
  utm_campaign: [],
  utm_ad: [],
};


export const CommunicationsTable = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [utmOptions, setUtmOptions] = useState({
    utm_source: [],
    utm_medium: [],
    utm_campaign: [],
    utm_ad: [],
    utm_channel: [],
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState(filterInitialState);
  const [advisors,setAdvisors]= useState([]);
  const navigate = useNavigate();

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

  const fetchAdvisors = async () => {
    const adv = await GetAdvisors();
    const data = adv?.data;
    setAdvisors(data);
  };

  const fetchGlossary = async () => {
    const glossary = await GetGlossary();
    if (glossary && glossary.data) {
      const options = {
        utm_source: [...new Set(glossary.data.map((item) => item.utm_source).filter(Boolean))],
        utm_medium: [...new Set(glossary.data.map((item) => item.utm_medium).filter(Boolean))],
        utm_campaign: [...new Set(glossary.data.map((item) => item.utm_campaign).filter(Boolean))],
        utm_ad: [...new Set(glossary.data.map((item) => item.utm_ad).filter(Boolean))],
        utm_channel: [...new Set(glossary.data.map((item) => item.utm_channel).filter(Boolean))],
      };
      setUtmOptions(options);
    }
  };

  useEffect(() => {
    fetchAdvisors();
    fetchData();
    fetchGlossary();
  }, []);

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      Swal.fire({
        title: "Advertencia",
        text: "No hay datos para exportar",
        icon: "warning",
      });
    }else exportTableToCSV(columns, filteredData);
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
      await PostCSV(file);
    } else {
      Swal.fire({
        icon: "info",
        title: "Cancelado",
        text: "No se seleccionó ningún archivo.",
      });
    }
  };


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

  const GoToBroadcastTable = () => {
    const queryParams = new URLSearchParams({
      filters: JSON.stringify(filters),
    }).toString();

    navigate(`/broadcast?${queryParams}`);
  };

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
    {
      title: 'UTM Source',
      dataIndex: ['utm', 'utm_source'],
      key: 'utm_source',
    },
    {
      title: 'UTM Medium',
      dataIndex: ['utm', 'utm_medium'],
      key: 'utm_medium',
    },
    {
      title: 'UTM Channel',
      dataIndex: ['utm', 'utm_channel'],
      key: 'utm_channel',
    },
    {
      title: 'UTM Campaign',
      dataIndex: ['utm', 'utm_campaign'],
      key: 'utm_campaign',
    },
    {
      title: 'UTM Ad',
      dataIndex: ['utm', 'utm_ad'],
      key: 'utm_ad',
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
                                {advisors.map((advisor) => (
                                  <Option key={advisor.phone} value={advisor.name}>
                                    {advisor.name}
                                  </Option>
                                ))}
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
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="UTM Source">
                      <Select
                        mode="multiple"
                        placeholder="Seleccione UTM Source"
                        onChange={(value) => handleSelectChange('utm_source', value)}
                        value={filters.utm_source}
                      >
                        {utmOptions.utm_source.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="UTM Medium">
                      <Select
                        mode="multiple"
                        placeholder="Seleccione UTM Medium"
                        onChange={(value) => handleSelectChange('utm_medium', value)}
                        value={filters.utm_medium}
                      >
                        {utmOptions.utm_medium.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="UTM Channel">
                      <Select
                        mode="multiple"
                        placeholder="Seleccione UTM Channel"
                        onChange={(value) => handleSelectChange('utm_channel', value)}
                        value={filters.utm_channel}
                      >                        
                        {utmOptions.utm_channel.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="UTM Campaign">
                      <Select
                        mode="multiple"
                        placeholder="Seleccione UTM Campaign"
                        onChange={(value) => handleSelectChange('utm_campaign', value)}
                        value={filters.utm_campaign}
                      >
                        {utmOptions.utm_campaign.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="UTM Ad">
                      <Select
                        mode="multiple"
                        placeholder="Seleccione UTM Ad"
                        onChange={(value) => handleSelectChange('utm_ad', value)}
                        value={filters.utm_ad}
                      >
                        {utmOptions.utm_ad.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
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
        <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
              <Button type="primary" onClick={GoToBroadcastTable} style={{ backgroundColor: '#f2b600', borderColor: '#f2b600' }}>
                  Send Broadcast
              </Button>
              <Button type="primary" onClick={handleExportCSV} style={{ backgroundColor: '#219e00', borderColor: '#219e00', marginLeft: 8 }}>
                  Export CSV
              </Button>
          </div>
          <Button type="primary" onClick={handleImportCSV} style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
              Import CSV
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
            showTotal={(total) => `Total ${total}`}
            disabled={loading}
        />
    </div>
  );

};


