import React, { useEffect, useState } from 'react';
import { GetLogs } from '../ApiHandler';
import { Table, Button, Select, Form, Row, Col, DatePicker, Pagination } from 'antd';
import { Tag } from 'antd';
import dayjs from 'dayjs';

import Swal from "sweetalert2";

const { RangePicker } = DatePicker;
const { Option } = Select;

const filterInitialState = {
  level: null,
  module: null,
  time_gt: null,
  time_lt: null,
};

const getLevelTagColor = (level) => {
    switch (level) {
      case 'INFO':
        return 'blue';
      case 'DEBUG':
        return 'cyan';
      case 'WARN':
        return 'orange';
      case 'ERROR':
        return 'red';
      default:
        return 'default'; 
    }
  };

export const LogsTable = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(filterInitialState);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10,
  });

  const fetchData = async (current = null, pageSize = null, filt = null) => {
    setLoading(true);
    try {
      const data = await GetLogs(filt ?? filters, current ?? pagination.current, pageSize ?? pagination.pageSize);
      if (Array.isArray(data.data)) {
        setFilteredData(data.data);
        setPagination({
          current: data.pagination.page,
          total: data.pagination.total,
          pageSize: data.pagination.page_size,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Los datos no están en el formato esperado.",
          icon: "error",
        });
        setFilteredData([]);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los datos.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFiltersChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (dates) => {
    setFilters({
      ...filters,
      time_gt: dates ? dates[0].toISOString() : null,
      time_lt: dates ? dates[1].toISOString() : null,
    });
  };

  const handleSearch = () => {
    fetchData(1, pagination.pageSize, filters);
  };

  const resetFilters = () => {
    setFilters(filterInitialState);
    fetchData(1, pagination.pageSize, filterInitialState);
  };

  const handlePageChange = (page, pageSize) => {
    fetchData(page, pageSize);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'time',
      key: 'time',
      render: (time) => dayjs(time).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level) => <Tag color={getLevelTagColor(level)}>{level}</Tag>,
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
    },
    {
      title: 'Message',
      dataIndex: 'msg',
      key: 'msg',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 4, marginBottom: 24 }}>
        <Form layout="vertical">
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="Level">
                <Select
                  placeholder="Seleccione nivel"
                  value={filters.level}
                  onChange={(value) => handleFiltersChange('level', value)}
                >
                  <Option value="INFO">INFO</Option>
                  <Option value="DEBUG">DEBUG</Option>
                  <Option value="WARN">WARN</Option>
                  <Option value="ERROR">ERROR</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Module">
                <Select
                  placeholder="Seleccione módulo"
                  value={filters.module}
                  onChange={(value) => handleFiltersChange('module', value)}
                >
                  <Option value="store">store</Option>
                  <Option value="whatsapp">whatsapp</Option>
                  <Option value="webhook">webhook</Option>
                  <Option value="infobip">infobip</Option>
                  <Option value="flow">flow</Option>
                  <Option value="pipedrive">pipedrive</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Rango de Fechas">
                <RangePicker style={{ width: '100%' }} onChange={handleDateChange} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Button type="primary" onClick={handleSearch} block>
                Buscar
              </Button>
            </Col>
            <Col span={8}>
              <Button type="primary" danger onClick={resetFilters} block>
                Resetear filtros
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => record._id}
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
