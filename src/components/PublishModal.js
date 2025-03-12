import React, { useEffect, useState } from "react";
import { Modal, List, Checkbox, Button, Typography, Spin,Card } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { GetPublications,PostPublications,GetOneProperty } from "../ApiHandler";

const STATUS_MAP = {
  published: { label: "Published", color: "green", icon: <CheckCircleOutlined /> },
  not_published: { label: "Not published", color: "gray" },
  in_progress: { label: "Publishing in progress...", color: "orange", icon: <Spin /> },
  failed: { label: "Failed to publish", color: "red", icon: <CloseCircleOutlined /> },
};

export const PublishModal = ({ isVisible, onClose,propertyId }) => {
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPortals, setSelectedPortals] = useState([]);
  const [property, setProperty] = useState({});

  useEffect(() => {
    if (isVisible) {
      setLoading(true);
      setSelectedPortals([]);
      Promise.all([
        GetPublications(propertyId),
        GetOneProperty(propertyId)
      ])
        .then(([publications, prop]) => {
          setPortals(publications?.data);
          setProperty(prop?.data);
        })
        .finally(() => setLoading(false));
    }
  }, [isVisible,propertyId]);

  const handleCheckboxChange = (portal, checked) => {
    setSelectedPortals((prev) =>
      checked ? [...prev, portal] : prev.filter((p) => p !== portal)
    );
  };

  const handlePublish = async () => {
    if (selectedPortals.length === 0) return;

    setLoading(true);
    await PostPublications(
      selectedPortals.map((portal) => ({ property_id: propertyId, portal }))
    );
    setLoading(false);
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Typography.Title level={4}>Publish to Portals</Typography.Title>
      <Typography.Title level={5}>Property: {property?.title}</Typography.Title>
      <Typography.Text type="secondary">{property?.description}</Typography.Text>
      <List
        dataSource={portals}
        loading={loading}
        renderItem={(item) => {
          const status = STATUS_MAP[item.status] || STATUS_MAP.not_published;
          return (
            <List.Item style={{ padding: 2 , display: "flex", justifyContent: "space-between",borderBottom: "none"}}>
              <Card style={{ width: "100%" }}>
                <Checkbox
                disabled={item.status === "published" || item.status === "in_progress"}
                onChange={(e) => handleCheckboxChange(item.portal, e.target.checked)}
                checked={selectedPortals.includes(item.portal)}
                />{"  "} 
                <Typography.Text strong>{item.portal}</Typography.Text>
                <div style={{ marginTop: 5 }}>
                    <Typography.Text type="secondary" style={{ color: status.color }}>{status.icon} {status.label}</Typography.Text>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
      <Typography.Text type="secondary">
        Publishing may take a few minutes
      </Typography.Text>
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handlePublish}
          disabled={loading || selectedPortals.length === 0}
        >
          Publish Selected
        </Button>
      </div>
    </Modal>
  );
};
