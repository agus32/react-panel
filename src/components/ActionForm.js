import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, TimePicker } from 'antd';
import { default as JSONSchemaForm } from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';
import { schemas,parseTime } from '../config';
import { fieldsList, RenderFieldByType } from './ConditionSelect';
import { PostAction, GetFlows,GetOneFlow } from '../ApiHandler';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;




const initialState = [
  {
    id: 1,
    conditions: [{ id: 1, field: fieldsList[0].name, value: "" }],
    actions: [{ id: 1, schemaKey: Object.keys(schemas)[0], formData: {}, interval: dayjs("00:00:00", 'HH:mm:ss') }],
    on_response: ""
  }
];

export const ActionForm = () => {
  const [conditions, setConditions] = useState(initialState);
  const [nextRuleId, setNextRuleId] = useState(2);
  const [nextConditionId, setNextConditionId] = useState(2);
  const [nextActionId, setNextActionId] = useState(2);
  const [name, setName] = useState('');
  const [flows, setFlows] = useState([]);
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();


  useEffect(() => {
    const editID = searchParams.get('edit');
    if (editID) {
      const fetchFlow = async () => {
        const flw = await GetOneFlow(editID);
        const data = flw?.data;
        if (data) {
          setName(data.name);
          const rules = data.rules;
          console.log(rules["actions"])
          setConditions(rules.map((rule, ruleIndex) => {
        return {
          id: ruleIndex + 1,
          conditions: Object.keys(rule.condition).map((key, index) => {
            return {
              id: index + 1,
              field: key,
              value: key.includes("fecha") ? dayjs(rule.condition[key],'YYYY-MM-DD') : rule.condition[key]
            };
          }),
          actions: rule.actions.map((action, actionIndex) => {
            return {
          id: actionIndex + 1,
          schemaKey: action.action,
          formData: action.params || {},
          interval: dayjs(parseTime(action.interval), 'HH:mm:ss')
            };
          }),
          on_response: rule.on_response || ""
        };
          }));
          console.log('conditions', conditions);
          setNextRuleId(rules.length + 1);
          setNextConditionId(rules.reduce((acc, rule) => acc + Object.keys(rule.condition).length, 1));
          setNextActionId(rules.reduce((acc, rule) => acc + rule.actions.length, 1));
        }
      };
      fetchFlow();
    }
    const fetchFlows = async () => {
      const flw = await GetFlows();
      const data = flw?.data;
      const flowsKeys = data ? Object.entries(data).map(([uuid, { name }]) => ({ uuid, name })) : [];
      setFlows(flowsKeys);
    };
    fetchFlows();
  }, []);

  const addRule = () => {
    setConditions([
      ...conditions,
      {
        id: nextRuleId,
        conditions: [{ id: nextConditionId, field: fieldsList[0].name, value: "" }],
        actions: [{ id: nextActionId, schemaKey: Object.keys(schemas)[0], formData: {}, interval: dayjs("00:00:00", 'HH:mm:ss') }]
      }
    ]);
    setNextRuleId(nextRuleId + 1);
    setNextConditionId(nextConditionId + 1);
    setNextActionId(nextActionId + 1);
  };

  const removeRule = (ruleId) => {
    setConditions(conditions.filter(rule => rule.id !== ruleId));
  };

  const addConditionToRule = (ruleId) => {
    setConditions(conditions.map(rule => {
      if (rule.id === ruleId) {
        const newCondition = { id: nextConditionId, field: fieldsList[0].name, value: "" };
        return { ...rule, conditions: [...rule.conditions, newCondition] };
      }
      return rule;
    }));
    setNextConditionId(nextConditionId + 1);
  };

  const removeConditionFromRule = (ruleId, conditionId) => {
    setConditions(conditions.map(rule => {
      if (rule.id === ruleId && rule.conditions.length > 1) {
        return { ...rule, conditions: rule.conditions.filter(condition => condition.id !== conditionId) };
      }
      return rule;
    }));
  };

  const handleConditionChangeInRule = (ruleId, conditionId, fieldName) => {
    setConditions(conditions.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          conditions: rule.conditions.map(condition => {
            if (condition.id === conditionId) {
              return { ...condition, field: fieldName, value: "" };
            }
            return condition;
          })
        };
      }
      return rule;
    }));
  };

  const handleConditionValueChange = (ruleId, conditionId, value) => {
    setConditions(conditions.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          conditions: rule.conditions.map(condition => {
            if (condition.id === conditionId) {
              return { ...condition, value };
            }
            return condition;
          })
        };
      }
      return rule;
    }));
  };

  const addActionToRule = (ruleId) => {
    setConditions(conditions.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          actions: [...rule.actions, { id: nextActionId, schemaKey: Object.keys(schemas)[0], formData: {}, interval: '0s' }]
        };
      }
      return rule;
    }));
    setNextActionId(nextActionId + 1);
  };

  const removeActionFromRule = (ruleId, actionId) => {
    setConditions(conditions.map(rule => {
      if (rule.id === ruleId) {
        return { ...rule, actions: rule.actions.filter(action => action.id !== actionId) };
      }
      return rule;
    }));
  };

  const handleTimeChange = (ruleId, actionId, time) => {
    setConditions(conditions.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          actions: rule.actions.map(action => {
            if (action.id === actionId) {
              return { ...action, interval: time };
            }
            return action;
          })
        };
      }
      return rule;
    }));
  };

  const handleSchemaChange = (ruleId, actionId, value) => {
    setConditions(conditions.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          actions: rule.actions.map(action => {
            if (action.id === actionId) {
              return { ...action, schemaKey: value };
            }
            return action;
          })
        };
      }
      return rule;
    }));
  };

  const handleFlowChange = (ruleId, value) => {
    setConditions(conditions.map(rule => {
      if (rule.id === ruleId) {
        return { ...rule, on_response: value };
      }
      return rule;
    }));
  };

  const handleFormDataChange = (ruleId, actionId, newFormData) => {
    setConditions(conditions.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          actions: rule.actions.map(action => {
            if (action.id === actionId) {
              return { ...action, formData: newFormData };
            }
            return action;
          })
        };
      }
      return rule;
    }));
  };

  const handleSubmit = async () => {
    const edit = searchParams.get('edit');
    await PostAction(name, conditions,edit);
    setConditions(initialState);
    setNextRuleId(2);
    setNextConditionId(2);
    setNextActionId(2);
    setName('');
  };

  return (
    <Form layout="vertical" style={{ marginTop: '20px' }}>
      <Form.Item label="Nombre">
        <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Item>

      {conditions.map(rule => (
        <div key={rule.id} style={{marginBottom: '10px', border: '1px solid #ddd', padding: '10px' }}>
          <div style={{ marginBottom: '10px',display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Rule {rule.id}</span>
            <Button type="primary" danger onClick={() => removeRule(rule.id)}>Delete Rule</Button>
          </div>

          <Form.Item label="On Response">
            <Select
              onChange={(value) => handleFlowChange(rule.id, value)}
              value={rule.on_response}
              defaultValue=""
              style={{ flex: 1 }}
            >
              <Option value="">Seleccione Flow</Option>
              {flows.map(flow => (
                <Option key={flow.uuid} value={flow.uuid}>
                  {flow.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <label>Conditions</label>
          {rule.conditions.map(condition => (
              <Form.Item key={condition.id} style={{ marginBottom: '10px' }}>
              <Input.Group compact>
                <Select
                  style={{ width: '40%' }}
                  value={condition.field}
                  onChange={(value) => handleConditionChangeInRule(rule.id, condition.id, value)}
                >
                  {fieldsList.map((field) => (
                    <Option key={field.name} value={field.name}>
                      {field.name}
                    </Option>
                  ))}
                </Select>
                <RenderFieldByType
                  type={fieldsList.find((field) => field.name === condition.field)?.type}
                  value={condition.value}
                  onChange={(value) => handleConditionValueChange(rule.id, condition.id, value)}
                />
                <Button
                  type="primary"
                  danger
                  onClick={() => removeConditionFromRule(rule.id, condition.id)}
                  disabled={rule.conditions.length === 1}
                >
                  Delete Condition
                </Button>
              </Input.Group>
            </Form.Item>
          ))}

          <Button type="primary" style={{ marginBottom: '20px'}}onClick={() => addConditionToRule(rule.id)}>+ New Condition</Button>
          
          {rule.actions.map(action => (
            <div key={action.id} style={{ marginBottom: '10px' }}>
              <Form.Item>
                <Input.Group compact>
                  <Select
                    defaultValue={action.schemaKey}
                    style={{ width: '30%' }}
                    onChange={(value) => handleSchemaChange(rule.id, action.id, value)}
                  >
                    {Object.keys(schemas).map(actionName => (
                      <Option key={actionName} value={actionName}>{schemas[actionName].name}</Option>
                    ))}
                  </Select>
                  <TimePicker defaultValue={dayjs('00:00:00', 'HH:mm:ss')} onChange={(time) => handleTimeChange(rule.id, action.id, time)} value={action.interval}/>
                  <Button type="primary" danger onClick={() => removeActionFromRule(rule.id, action.id)}>Delete Action</Button>
                </Input.Group>

                <JSONSchemaForm
                  schema={schemas[action.schemaKey].schema || {}}
                  formData={action.formData}
                  onChange={(e) => handleFormDataChange(rule.id, action.id, e.formData)}
                  validator={validator}
                  uiSchema={{
                    'ui:submitButtonOptions': {
                      norender: true,
                    },
                  }}
                />
              </Form.Item>
            </div>
          ))}

          <Button type="primary" onClick={() => addActionToRule(rule.id)}>+ New Action</Button>
        </div>
      ))}

      <Button type="primary" onClick={addRule}>+ New Rule</Button>
      <Button type="primary" onClick={handleSubmit} style={{ marginTop: '5px', backgroundColor: '#008000', borderColor: '#008000', marginLeft: "5px" }}>Save</Button>
    </Form>
  );
};
