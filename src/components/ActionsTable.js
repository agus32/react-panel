import React,{useState,useEffect} from 'react';
import { Table, Button, Space } from 'antd';
import { GetFlows,SetMainFlow,DeleteFlow } from '../ApiHandler';
import { useNavigate } from 'react-router-dom';





export const ActionsTable = () => {
  const [flows, setFlows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlows();
  }, []);

  const GoToBroadcast = (uuid) => {
    navigate(`/broadcast?flow=${uuid}`);
  }


  const fetchFlows = async () => {
    const flw = await GetFlows();
    const data = flw?.data;
    const flowsArray = data ? Object.values(data) : [];
    setFlows(flowsArray);
  };

  const handleDelete = async (uuid) => {
    await DeleteFlow(uuid);
    fetchFlows();
  }
  const handleSetMain = async (uuid) => {
    await SetMainFlow(uuid);
    fetchFlows();
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ID',
      dataIndex: 'uuid',
      key: 'uuid',
    },
    {
      title: 'Status',
      key: 'status',
      render: (record, index) => (
        record.is_main ? (
          <Button type="primary" shape="round" disabled style={{ backgroundColor: '#008f39', borderColor: '#008f39', color: 'white' }}>Main</Button>
        ) : (
          <Button shape="round" onClick={() => handleSetMain(record.uuid)}>Set as main</Button>
        )
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record,index) => (
        <Space size="middle">
          <Button type="primary" onClick={() => GoToBroadcast(record.uuid)} style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }}>Send Broadcast</Button>
          <Button type="primary" onClick={() => navigate(`/acciones/nueva/?edit=${record.uuid}`)} style={{ backgroundColor: '#e6ad27', borderColor: '#e6ad27' }}>Edit</Button>
          <Button type="primary" danger disabled={record.is_main} onClick={() => handleDelete(record.uuid)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2 style={{ marginTop: 16 }}>Flows</h2>
      <Table
        columns={columns}
        dataSource={flows}
        rowKey={(record) => record.uuid}
        pagination={{ position: ['bottomCenter'] }}
      />
    </>
  );
};
