import React, { useState } from 'react';
import { Form, Input, Button, Select, TimePicker } from 'antd';
import { actions } from '../config';

const { Option } = Select;

export const ActionForm = () => {
  const [conditions, setConditions] = useState([{ id: 1, actions: [{ id: 1 }] }]);
  const [nextConditionId, setNextConditionId] = useState(2);
  const [nextActionId, setNextActionId] = useState(2);

  const addCondition = () => {
    setConditions([...conditions, { id: nextConditionId, actions: [{ id: nextActionId }] }]);
    setNextConditionId(nextConditionId + 1);
    setNextActionId(nextActionId + 1);
  };

  const removeCondition = (id) => {
    setConditions(conditions.filter(condition => condition.id !== id));
  };

  const addAction = (conditionId) => {
    setConditions(conditions.map(condition => {
      if (condition.id === conditionId) {
        return { ...condition, actions: [...condition.actions, { id: nextActionId }] };
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

  return (
    <Form layout="vertical" style={{ marginTop: '20px' }}>
      <Form.Item label="Nombre">
        <Input placeholder="Nombre" />
      </Form.Item>
      
      {conditions.map(condition => (
        <div key={condition.id} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
          <Form.Item label={`Condition ${condition.id}`}>
            <Input.Group compact>
              <Select defaultValue={actions.fields[0]} style={{ width: '20%' }}>
                {actions.fields.map(field => (
                  <Option key={field} value={field}>{field}</Option>
                ))}
              </Select>
              <Select defaultValue={actions.conditions[0]} style={{ width: '20%' }}>
                {actions.conditions.map(condition => (
                  <Option key={condition} value={condition}>{condition}</Option>
                ))}
              </Select>
              <Input style={{ width: '40%' }} placeholder="value" />
              <Button type="primary" danger onClick={() => removeCondition(condition.id)}>Delete condition</Button>
            </Input.Group>
          </Form.Item>
          
          {condition.actions.map(action => (
            <div key={action.id} style={{ marginBottom: '10px' }}>
              <Form.Item>
                <Input.Group compact>
                  <Select defaultValue={actions.actions[0].name} style={{ width: '30%' }}>
                    {actions.actions.map(actionOption => (
                      <Option key={actionOption.name} value={actionOption.name}>{actionOption.label}</Option>
                    ))}
                  </Select>
                  <TimePicker minuteStep={15} secondStep={10} hourStep={1} />
                  <Button type="primary" danger onClick={() => removeAction(condition.id, action.id)}>Delete action</Button>
                </Input.Group>
                <Input.TextArea style={{ width: '100%' }} placeholder="Details" />
              </Form.Item>
            </div>
          ))}
          
          <Button type="primary" onClick={() => addAction(condition.id)}>+ New Action</Button>
        </div>
      ))}
      
      <Button type="primary" onClick={addCondition}>+ New Condition</Button>
      <Button type="primary" style={{ marginTop: '20px', backgroundColor: '#008000', borderColor: '#008000',marginLeft:"5px" }}>Save Action</Button>
    </Form>
  );
};