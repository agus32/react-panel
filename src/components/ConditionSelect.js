import React, { useEffect, useState } from 'react';
import {GetGlossary,GetAdvisors} from '../ApiHandler';
import { Select, Input, DatePicker } from 'antd';


const { Option } = Select;

export const fieldsList = [
    { name: "is_new", type: "select" },
    { name: "nombre", type: "input" },
    { name: "telefono", type: "input" },
    { name: "fuentes", type: "fuentes" },
    { name: "asesores", type: "asesores" },
    { name: "fecha_from", type: "date" },
    { name: "fecha_to", type: "date" },
    { name: "utm_source", type: "utm_source" },
    { name: "utm_medium", type: "utm_medium" },
    { name: "utm_campaign", type: "utm_campaign" },
    { name: "utm_ad", type: "utm_ad" },
    { name: "utm_channel", type: "utm_channel" },
];



export const RenderFieldByType = ({ type, value, onChange }) =>{
  const [advisors,setAdvisors]= useState([]);
  const [utmOptions, setUtmOptions] = useState({
      utm_source: [],
      utm_medium: [],
      utm_campaign: [],
      utm_ad: [],
      utm_channel: [],
  });

  useEffect(() => {
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
    const fetchAdvisors = async () => {
      const adv = await GetAdvisors();
      const data = adv?.data;
      setAdvisors(data);
    };
    fetchAdvisors();
    fetchGlossary();
    }, []);

    const renderUtmSelect = (utmKey) => (
        <Select style={{ width: '40%' }} value={value} onChange={onChange}>
          <Option value="">Seleccionar</Option>
          {utmOptions[utmKey].map((option, index) => (
            <Option key={index} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      );
  switch (type) {
    case "select":
    return (
      <Select style={{ width: '40%' }} value={value} onChange={onChange}>
      <Option value="">Seleccionar</Option>
      <Option value={true}>True</Option>
      <Option value={false}>False</Option>
      </Select>
    );
    case "asesores":
    return (
      <Select style={{ width: '40%' }} value={value} onChange={onChange}>
      <Option key="" value="">Seleccionar</Option>
      {advisors.map((advisor) => (
        <Option key={advisor.id} value={advisor.id}>
        {advisor.name}
        </Option>
        ))}
      </Select>
    );
    case "fuentes":
    return (
      <Select style={{ width: '40%' }} value={value} onChange={onChange}>
        <Option value="">Seleccionar</Option>
        <Option value="Propiedades">Propiedades</Option>
        <Option value="Whatsapp">Whatsapp</Option>
        <Option value="ivr">IVR</Option>
        <Option value="lamudi">Lamudi</Option>
        <Option value="inmuebles24">Inmuebles24</Option>
        <Option value="casasyterrenos">Casas y Terrenos</Option>
      </Select>
    );
    case "date":
      return (
        <DatePicker
            style={{ width: '40%' }}
            value={value || null}
            onChange={(date) => onChange(date)}
        />
      );
    case "utm_source":
    case "utm_medium":
    case "utm_campaign":
    case "utm_ad":
    case "utm_channel":
      return renderUtmSelect(type);
    default:
      return (
        <Input
        style={{ width: '40%' }}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}
