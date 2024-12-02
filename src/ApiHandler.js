import Swal from "sweetalert2";
import dayjs from 'dayjs';
const HOST = "https://reboraautomatizaciones.com/api";




const handleAlert = (message, type) => {

  let formattedMessage = message;

  if (typeof message === "object") { 
    const messageErrors = message.map(error => error.message);
    formattedMessage = messageErrors.join("\n");
  }

  const title = type === "success" ? "Éxito" : "Error";
  Swal.fire({
    title: title,
    text: formattedMessage,
    icon: type,
  });
};

export const fetchData = async (endpoint, method, body = null) => {
  const URL = `${HOST}/${endpoint}`;
  const headers = {
    "Content-type": "application/json; charset=UTF-8",
  };

  const requestOptions = {
    method,
    headers,
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(URL, requestOptions);
    const data = await response.json();
    if(response.ok){
      if(method !== "GET") handleAlert(data.message, "success");
    }else handleAlert(data.errors ?? data.error, "error");


    return data;
  } catch (error) {
    const errorMessage = error.toString() || "Error desconocido";
    handleAlert(errorMessage, "error");
    return null;
  }
};



export const GetCommunications = async (filter,page,pageSize) => {
  function toQueryParams(filter) {
    const params = new URLSearchParams();
  
    filter.fechaDesde && params.append('fecha_from', `${filter.fechaDesde.$y}-${String(filter.fechaDesde.$M + 1).padStart(2, '0')}-${String(filter.fechaDesde.$D).padStart(2, '0')}`);
    filter.fechaHasta && params.append('fecha_to', `${filter.fechaHasta.$y}-${String(filter.fechaHasta.$M + 1).padStart(2, '0')}-${String(filter.fechaHasta.$D).padStart(2, '0')}`);
    filter.asesores.length && params.append('asesor_name', filter.asesores.join(','));
    filter.fuentes.length && params.append('fuente', filter.fuentes.join(','));
    filter.nombre.length && params.append('nombre', filter.nombre);
    filter.telefono.length && params.append('telefono', filter.telefono);
    filter.utm_source?.length && params.append('utm_source', filter.utm_source);
    filter.utm_medium?.length && params.append('utm_medium', filter.utm_medium);
    filter.utm_campaign?.length && params.append('utm_campaign', filter.utm_campaign);
    filter.utm_ad?.length && params.append('utm_ad', filter.utm_ad);
    filter.utm_channel?.length && params.append('utm_channel', filter.utm_channel);


    page && params.append('page', page);
    pageSize && params.append('page_size', pageSize);
    filter.is_new !== null && params.append('is_new', filter.is_new);
    return `?${params.toString()}`;
  }
  
  const queryParams = toQueryParams(filter);
  return fetchData(`communications${queryParams}`, "GET");
};

export const GetAdvisors = async () => {
  return fetchData(`asesor`, "GET");
};

export const GetFlows = async () => {
  return fetchData(`flows`, "GET");
};

export const GetLogs = async (filter,page,pageSize) => {
 
  function toQueryParams(filter) {
    const params = new URLSearchParams();

    filter.time_gt && params.append('time_gt', filter.time_gt);
    filter.time_lt && params.append('time_lt', filter.time_lt);
    filter.module && params.append('module', filter.module);
    filter.level && params.append('level', filter.level);
    
    page && params.append('page', page);
    pageSize && params.append('page_size', pageSize);

    return `?${params.toString()}`;
  }
  
  const queryParams = toQueryParams(filter);
 
 console.log(filter,page,pageSize);
  return fetchData(`logs${queryParams}`, "GET");
};

export const SetMainFlow = async (uuid) => {
  return fetchData(`mainFlow`, "POST",{uuid});
};

export const SendBroadcast = async (filters,uuid) => {
  const filterParams = {
    fecha_from: filters.fechaDesde ? dayjs(filters.fechaDesde).format('YYYY-MM-DDTHH:mm:ssZ') : undefined,
    fecha_to: filters.fechaHasta ? dayjs(filters.fechaHasta).format('YYYY-MM-DDTHH:mm:ssZ') : undefined,
    asesor_name: filters.asesores.length ? filters.asesores.join(',') : undefined,
    fuente: filters.fuentes.length ? filters.fuentes.join(',') : undefined,
    nombre: filters.nombre.length ? filters.nombre : undefined,
    telefono: filters.telefono.length ? filters.telefono : undefined,
    is_new: filters.is_new !== null ? filters.is_new : undefined,
    utm_source: filters.utm_source?.length ? filters.utm_source.join(',') : undefined,
    utm_medium: filters.utm_medium?.length ? filters.utm_medium.join(',') : undefined,
    utm_campaign: filters.utm_campaign?.length ? filters.utm_campaign.join(',') : undefined,
    utm_ad: filters.utm_ad?.length ? filters.utm_ad.join(',') : undefined,
    utm_channel: filters.utm_channel?.length ? filters.utm_channel.join(',') : undefined,
  };

  const filteredParams = Object.fromEntries(Object.entries(filterParams).filter(([_, v]) => v !== undefined));
  return fetchData(`broadcast`, "POST", {uuid,condition:filteredParams});

};

export const DeleteFlow = async (uuid) => {
  return fetchData(`flows/${uuid}`, "DELETE");
};

export const toggleAdvisorActive = async ( phone,value) => {
  return fetchData(`asesor/${phone}`, "PUT", {active:value});
};

export const DeleteAdvisor = async (phone) => {
  return fetchData(`asesor/${phone}`, "DELETE");
};

export const PutAdvisor = async ( phone,values) => {
  console.log(values);
  console.log(phone);
  return fetchData(`asesor/${phone}`, "PUT", values);
};

export const AddAdvisor = async (inputs) => {
  return fetchData("asesor", "POST", {...inputs,active:true});
};


export const ReasignAdvisor = async (phone) => {
  return fetchData(`asesor/${phone}/reasign`, "PUT");
};

export const PostAction = async (name,conditions) => {

  const finalData = {
    name: name,
    rules: conditions.map(condition => ({
      condition: {
        ...(condition.is_new !== undefined && condition.is_new !== null && { is_new: condition.is_new })
      },
      actions: condition.actions.map(action => ({
        action: action.schemaKey,
        interval: action.interval ? `${action.interval.$H}h${action.interval.$m}m${action.interval.$s}s` : "0s",
        params: action.formData
      }))
    }))
  };

  return fetchData("flows", "POST", finalData);
};


export const GetGlossary = async () => {
  return fetchData(`utm`, "GET");
};

export const PostGlossary = async (item) => {
  return fetchData("utm", "POST", item);
};

export const PutGlossary = async (id, item) => {
  return fetchData(`utm/${id}`, "PUT", item);
};

export const DeleteGlossary = async (id) => {
  return fetchData(`utm/${id}`, "DELETE");
};