import React, { useState,useEffect } from 'react';
import { Form, Input, Button, Select, TimePicker } from 'antd';
import { default as JSONSchemaForm } from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';
import { schemas } from '../config'; 
import { PostAction,GetFlows } from '../ApiHandler';

const { Option } = Select;

const initialState = [{ id: 1, is_new: undefined, actions: [{ id: 1, schemaKey: Object.keys(schemas)[0], formData: {}, interval: '0s' }] }];

export const ActionForm = () => {
  const [conditions, setConditions] = useState(initialState);
  const [nextConditionId, setNextConditionId] = useState(2);
  const [nextActionId, setNextActionId] = useState(2);
  const [name, setName] = useState('');
  const [flows , setFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState("");

  useEffect(() => {
    const fetchFlows = async () => {
      const flw = await GetFlows();
      const data = flw?.data;
      const flowsKeys = data ? Object.entries(data).map(([uuid, { name }]) => ({ uuid, name })) : [];
      setFlows(flowsKeys);
    };
  fetchFlows();
  }, []);

  const addCondition = () => {
    setConditions([...conditions, { id: nextConditionId, is_new: undefined, actions: [{ id: nextActionId, schemaKey: Object.keys(schemas)[0], formData: {}, interval: '0s' }] }]);
    setNextConditionId(nextConditionId + 1);
    setNextActionId(nextActionId + 1);
  };

  const removeCondition = (id) => {
    setConditions(conditions.filter(condition => condition.id !== id));
  };

  const addAction = (conditionId) => {
    setConditions(conditions.map(condition => {
      if (condition.id === conditionId) {
        return { ...condition, actions: [...condition.actions, { id: nextActionId, schemaKey: Object.keys(schemas)[0], formData: {}, interval: '0s' }] };
      }
      return condition;
    }));
    setNextActionId(nextActionId + 1);
  };

  const removeAction = (conditionId, actionId) => {
    setConditions(conditions.map(condition => {
      if (condition.id === conditionId) {
        return { ...condition, actions: condition.actions.filter(action => action.id !== actionId) };
      }
      return condition;
    }));
  };

  const handleSchemaChange = (conditionId, actionId, value) => {
    setConditions(conditions.map(condition => {
      if (condition.id === conditionId) {
        return {
          ...condition,
          actions: condition.actions.map(action => {
            if (action.id === actionId) {
              return { ...action, schemaKey: value };
            }
            return action;
          })
        };
      }
      return condition;
    }));
  };

  const handleFormDataChange = (conditionId, actionId, newFormData) => {
    setConditions(conditions.map(condition => {
      if (condition.id === conditionId) {
        return {
          ...condition,
          actions: condition.actions.map(action => {
            if (action.id === actionId) {
              return { ...action, formData: newFormData };
            }
            return action;
          })
        };
      }
      return condition;
    }));
  };

  const handleConditionChange = (conditionId, isNewValue) => {
    setConditions(conditions.map(condition => {
      if (condition.id === conditionId) {
        return { ...condition, is_new: isNewValue };
      }
      return condition;
    }));
  };

  // Maneja el cambio de tiempo en el TimePicker y lo formatea
  const handleTimeChange = (conditionId, actionId, time) => {

    setConditions(conditions.map(condition => {
      if (condition.id === conditionId) {
        return {
          ...condition,
          actions: condition.actions.map(action => {
            if (action.id === actionId) {
              return { ...action, interval:time };
            }
            return action;
          })
        };
      }
      return condition;
    }));
  };

  const handleSubmit = async () => {
    await PostAction(name,conditions,selectedFlow);
    setConditions(initialState);
    setNextActionId(2);
    setNextConditionId(2);
    setName('');  
    setSelectedFlow("");
  };

  return (
    <Form layout="vertical" style={{ marginTop: '20px' }}>
      <Form.Item label="Nombre">
        <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Item>
      <Form.Item label="On Response">
        <Select
            onChange={(value) => setSelectedFlow(value)}
            value={selectedFlow}
            defaultValue={""}
            style={{ flex: 1 }}
        >
            <Option value={""}>Seleccione Flow</Option>
            {flows.map(flow => (
                <Option key={flow.uuid} value={flow.uuid}>
                {flow.name}
                </Option>
            ))}                                
        </Select>
      </Form.Item>

      {conditions.map(condition => (
        <div key={condition.id} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Rule {condition.id}</span>
            <Button type="primary" danger onClick={() => removeCondition(condition.id)}>Delete rule</Button>
          </div>
          <Form.Item >
            <Input.Group compact>
              <Select
                  style={{ flex: 1 }}
                  defaultValue={""}

                >
                <Option value={""}>Seleccionar condicion</Option>
                <Option value={"is_new"}>is_new</Option>
              </Select>
              <Select
                defaultValue={""}
                style={{ flex: 1 }}
                onChange={(value) => handleConditionChange(condition.id, value)}
              >
                <Option value={""}>Seleccionar</Option>
                <Option value={true}>True</Option>
                <Option value={false}>False</Option>
              </Select>
            </Input.Group>
          </Form.Item>

          {condition.actions.map(action => (
            <div key={action.id} style={{ marginBottom: '10px' }}>
              <Form.Item>
                <Input.Group compact>
                  <Select
                    defaultValue={action.schemaKey}
                    style={{ width: '30%' }}
                    onChange={(value) => handleSchemaChange(condition.id, action.id, value)}
                  >
                    {Object.keys(schemas).map(actionName => (
                      <Option key={actionName} value={actionName}>{schemas[actionName].name}</Option>
                    ))}
                  </Select>
                  <TimePicker onChange={(time) => handleTimeChange(condition.id, action.id, time)} />
                  <Button type="primary" danger onClick={() => removeAction(condition.id, action.id)}>Delete action</Button>
                </Input.Group>

                <JSONSchemaForm 
                  schema={schemas[action.schemaKey].schema || {}}
                  formData={action.formData}
                  onChange={(e) => handleFormDataChange(condition.id, action.id, e.formData)}
                  validator={validator}
                  uiSchema={{
                    'ui:submitButtonOptions': {
                      norender: true,  // Oculta el botón de submit
                    },
                  }}
                />
              </Form.Item>              
            </div>
          ))}
          <Button type="primary" onClick={() => addAction(condition.id)}>+ New Action</Button>
        </div>
      ))}

      <Button type="primary" onClick={addCondition}>+ New Rule</Button>
      <Button type="primary" onClick={handleSubmit} style={{ marginTop: '5px', backgroundColor: '#008000', borderColor: '#008000', marginLeft: "5px" }}>Save</Button>
    </Form>
  );
};
