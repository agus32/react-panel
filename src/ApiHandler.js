import Swal from "sweetalert2";
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
    page && params.append('page', page);
    pageSize && params.append('page_size', pageSize);
    filter.is_new !== null && params.append('is_new', filter.is_new);
    return `?${params.toString()}`;
  }
  
  const queryParams = toQueryParams(filter);
  console.log(queryParams);
  return fetchData(`communications${queryParams}`, "GET");
};

/** 

export const GetLibro = async (isbn) => {
  return fetchData(`libro/${isbn}`, "GET");
};

export const GetMedioPago = async () => {
  return fetchData("venta/medios_pago", "GET");
};

export const PostPeople = async (inputs) => {
  return fetchData("persona", "POST", inputs);
};

export const PutLibro = async ({ edit, isbn }) => {
  return fetchData(`libro/${isbn}`, "PUT", edit);
};

export const PutCliente = async ({ edit, id }) => {
  return fetchData(`cliente/${id}`, "PUT", edit);
};

export const DeleteCliente = async (id) => {
  return fetchData(`cliente/${id}`, "DELETE");
};

export const PutPersonaLibro = async ({ persona, isbn }) => {
  return fetchData(`libro/${isbn}/personas`, "PUT", persona);
};

export const GetVentas = async (id) => {
  return fetchData(`cliente/${id}/ventas`, "GET");
};

export const GetAllVentas = async () => {
  return fetchData("venta", "GET");
};

export const GetConsignaciones = async () => {
  return fetchData("consignacion", "GET");
};

export const GetClientesConsignacion = async () => {
  return fetchData("cliente?stock=1", "GET");
};

export const GetConsignacionByID = async (id) => {
  return fetchData(`consignacion/${id}`, "GET");
};

export const GetVentaById = async (id) => {
  return fetchData(`venta/${id}`, "GET");
};

export const GetStockById = async (id) => {
  return fetchData(`cliente/${id}/stock`, "GET");
};

export const PostVenta = async (cliente, descuento, medio_pago,tipo_cbte, libros) => {
  return fetchData("venta", "POST", { cliente, descuento, medio_pago,tipo_cbte, libros });
};

export const PostLibro = async (inputs) => {
  return fetchData("libro", "POST", inputs);
};

export const PostPeopleLibro = async ({ people, isbn }) => {
  return fetchData(`libro/${isbn}/personas`, "POST", people);
};

export const PostPerson = async (inputs) => {
  return fetchData("persona", "POST", inputs);
};

export const PostCliente = async (inputs) => {
  return fetchData("cliente", "POST", inputs);
};

export const PostConsignacion = async (cliente,libros) => {
  return fetchData("consignacion", "POST", {cliente,libros});
};

export const PostVentaConsignacion = async (cliente,fecha_venta, descuento, medio_pago,tipo_cbte, libros) => {
  return fetchData("ventaConsignacion", "POST", { cliente,fecha_venta, descuento, medio_pago,tipo_cbte, libros });
};

export const PostDevolucionConsignacion = async (cliente,libros) => {
  return fetchData("devolucion", "POST", {cliente,libros});
};

export const DeletePersonFromBook = async ({ isbn, id, type }) => {
  const content = {
    id_persona: id,
    tipo: type,
  };

  return fetchData(`libro/${isbn}/personas`, "DELETE", content);
};

export const GetClientes = async () => {
  return fetchData("cliente", "GET");
};

export const DeletePerson = async (id) => {
  return fetchData(`persona/${id}`, "DELETE");
};

export const PostLogin = async (user) => {
  return fetchData("user/login", "POST", user);
};

export const ActaulizarListaPrecios = async (id) => {
  return fetchData(`cliente/${id}/stock`, "PUT");
};

*/