import React from 'react';
import { Table, Button, Space } from 'antd';


export const ActionsTable = ({ data, setMain, deleteItem }) => {
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Status',
      key: 'status',
      render: (record, index) => (
        record.isMain ? (
          <Button type="primary" shape="round" disabled style={{ backgroundColor: '#008f39', borderColor: '#008f39', color: 'white' }}>Main</Button>
        ) : (
          <Button shape="round" onClick={() => setMain(index)}>Set as main</Button>
        )
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (index) => (
        <Space size="middle">
          <Button type="primary" style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }}>Send Broadcast</Button>
          <Button type="primary" danger onClick={() => deleteItem(index)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.id}
      bordered
    />
  );
};
