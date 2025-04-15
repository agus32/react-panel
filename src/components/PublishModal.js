import React, { useEffect, useState } from "react";
import { Modal, List, Checkbox, Button, Typography, Card, Spin } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, LinkOutlined} from "@ant-design/icons";
import { GetPublications, PostPublications, GetOneProperty,UnpublishPublications } from "../ApiHandler";

const STATUS_MAP = {
  published: { label: "Published", color: "green", icon: <CheckCircleOutlined /> },
  not_published: { label: "Not published", color: "gray" },
  in_progress: { label: "Publishing in progress...", color: "orange", icon: <Spin /> },
  in_queue: { label: "In queue", color: "gray", icon: <Spin /> },
  failed: { label: "Failed to publish", color: "red", icon: <CloseCircleOutlined /> },
};

const portalMap = () => ({
  propiedades: (id) => `https://propiedades.com/inmuebles/-${id}`,
  lamudi: (id) => `https://www.lamudi.com.mx/detalle/${id}`,
  casasyterrenos: (id) => `https://www.casasyterrenos.com/propiedad/-${id}`,
  inmuebles24: (id) => `https://www.inmuebles24.com/propiedades/-${id}`,// no es este pero lo pongo para probar
});

const HARCODED_PORTALS = [
  { portal: "casasyterrenos", status: "not_published" },
  { portal: "inmuebles24", status: "not_published" },
  { portal: "lamudi", status: "not_published" },
  { portal: "propiedades", status: "not_published" },
];

const MESSAGES = {
  publish: {
    title: "Publish to Portals",
    subtitle: "Select the portals you want to publish to.",
    actionButton: "Publish Selected",
    infoNote: "Publishing may take a few minutes",
  },
  unpublish: {
    title: "Unpublish from Portals",
    subtitle: "Select the portals you want to unpublish from.",
    actionButton: "Unpublish Selected",
    infoNote: "Unpublishing may take a few minutes",
  },
};

export const PublishModal = ({ isVisible, onClose, propertyIds,isPublishing }) => {
  const [properties, setProperties] = useState([]);
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPortals, setSelectedPortals] = useState([]);

  const isMultiple = propertyIds.length > 1;

  const mode = isPublishing ? 'publish' : 'unpublish';
  const msg = MESSAGES[mode];

  const fetchData = async () => {
    console.log(propertyIds);
    setLoading(true);
    setSelectedPortals([]);
    try {
      if (isMultiple) {
        // Si hay varias propiedades, solo obtenemos sus detalles sin publicaciones
        console.log(propertyIds);
        const propertyData = await Promise.all(propertyIds.map(GetOneProperty));
        console.log(propertyData);
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
    const payload = propertyIds.flatMap((propertyId) =>
      selectedPortals.map((portal) => ({ property_id: propertyId, portal }))
    )
    if (isPublishing) {
      await PostPublications(payload);
    } else {
      await UnpublishPublications(payload); // Asumiendo que esta función ya está definida
    }
    await fetchData();
    setLoading(false);
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Typography.Title level={4}>{msg.title}</Typography.Title>
      <Typography.Paragraph type="secondary">{msg.subtitle}</Typography.Paragraph>
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
                  <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div>
                      <Checkbox
                        disabled={item.status === "published" || item.status === "in_progress"}
                        onChange={(e) => handleCheckboxChange(item.portal, e.target.checked)}
                        checked={selectedPortals.includes(item.portal)}
                      />{" "}
                      <Typography.Text strong>{item.portal}</Typography.Text>
                      <div style={{ marginTop: 5 }}>
                        <Typography.Text type="secondary" style={{ color: status.color }}>
                          {status.icon} {status.label}
                        </Typography.Text>
                      </div>
                    </div>
                  {!isMultiple && item.status === "published" && item.portal &&(
                    <div>
                      <Button
                        color="default"
                        variant="text"
                        size="small"
                        icon={<LinkOutlined />}
                        onClick={() => window.open(portalMap()[item.portal](item.publication_id), "_blank")}
                      />
                    </div>
                  )}
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
        
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between" }}>
        <Typography.Text type="secondary">
          {msg.infoNote}
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
          {msg.actionButton}
        </Button>
      </div>
    </Modal>
  );
};
