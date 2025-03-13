import React, { useEffect, useState } from "react";
import { Modal, List, Checkbox, Button, Typography, Card, Spin } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { GetPublications, PostPublications, GetOneProperty } from "../ApiHandler";

const STATUS_MAP = {
  published: { label: "Published", color: "green", icon: <CheckCircleOutlined /> },
  not_published: { label: "Not published", color: "gray" },
  in_progress: { label: "Publishing in progress...", color: "orange", icon: <Spin /> },
  failed: { label: "Failed to publish", color: "red", icon: <CloseCircleOutlined /> },
};


const HARCODED_PORTALS = [
  { portal: "casasyterrenos", status: "not_published" },
  { portal: "inmuebles24", status: "not_published" },
  { portal: "lamudi", status: "not_published" },
  { portal: "propiedades", status: "not_published" },
];

export const PublishModal = ({ isVisible, onClose, propertyIds }) => {
  const [properties, setProperties] = useState([]);
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPortals, setSelectedPortals] = useState([]);

  const isMultiple = propertyIds.length > 1;

  const fetchData = async () => {
    setLoading(true);
    setSelectedPortals([]);
    try {
      if (isMultiple) {
        // Si hay varias propiedades, solo obtenemos sus detalles sin publicaciones
        const propertyData = await Promise.all(propertyIds.map(GetOneProperty));
        setProperties(propertyData.map((prop) => prop?.data));
        setPortals(HARCODED_PORTALS);
      } else {
        // Si hay una sola propiedad, obtenemos sus publicaciones
        const [publications, property] = await Promise.all([
          GetPublications(propertyIds[0]),
          GetOneProperty(propertyIds[0])
        ]);
        setProperties([property?.data]);
        setPortals(publications?.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchData();
    }// eslint-disable-next-line
  }, [isVisible, propertyIds]);

  const handleCheckboxChange = (portal, checked) => {
    setSelectedPortals((prev) =>
      checked ? [...prev, portal] : prev.filter((p) => p !== portal)
    );
  };

  const handlePublish = async () => {
    if (selectedPortals.length === 0) return;
    setLoading(true);
    await PostPublications(
      propertyIds.flatMap((propertyId) =>
        selectedPortals.map((portal) => ({ property_id: propertyId, portal }))
      )
    );
    await fetchData();
    setLoading(false);
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Typography.Title level={4}>Publish to Portals</Typography.Title>
      {properties.map((property) => (
        <div key={property.id}>
          <Typography.Title level={5}>Property: {property?.title}</Typography.Title>
          <Typography.Text type="secondary">{property?.description?.slice(0,80)}</Typography.Text>
        </div>
      ))}
        <List
          dataSource={portals}
          loading={loading}
          renderItem={(item) => {
            const status = STATUS_MAP[item.status] || STATUS_MAP.not_published;
            return (
              <List.Item style={{ padding: 2, display: "flex", justifyContent: "space-between", borderBottom: "none" }}>
                <Card style={{ width: "100%" }}>
                  <Checkbox
                    disabled={item.status === "published" || item.status === "in_progress"}
                    onChange={(e) => handleCheckboxChange(item.portal, e.target.checked)}
                    checked={selectedPortals.includes(item.portal)}
                  />
                  <Typography.Text strong>{item.portal}</Typography.Text>
                  <div style={{ marginTop: 5 }}>
                    <Typography.Text type="secondary" style={{ color: status.color }}>
                      {status.icon} {status.label}
                    </Typography.Text>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
        
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between" }}>
        <Typography.Text type="secondary">
          Publishing may take a few minutes
        </Typography.Text>
        <Button color="primary" variant="outlined" onClick={fetchData} style={{ marginRight: 8 }}>
          Refresh ⟳
        </Button>
      </div>
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
