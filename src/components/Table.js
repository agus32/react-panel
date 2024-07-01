import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link
} from '@mui/material';

const HOST = "https://reboraautomatizaciones.com/api"

function formatToday() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [month, day, year].join('-');
}

export const DataTable = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const date = formatToday();
        axios.get(`${HOST}/communications?date=${date}`)
            .then(response => {
                if (response.data.success) {
                    console.log("recived");
                    setData(response.data.data);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <TableContainer component={Paper}>
        <Table>
        <TableHead>
        <TableRow>
        <TableCell>Fuente</TableCell>
        <TableCell>Fecha Lead</TableCell>
        <TableCell>Fecha</TableCell>
        <TableCell>Nombre</TableCell>
        <TableCell>Link</TableCell>
        <TableCell>Teléfono</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Cotización</TableCell>
        <TableCell>Asesor</TableCell>
        <TableCell>Teléfono Asesor</TableCell>
        <TableCell>Email Asesor</TableCell>
        <TableCell>Propiedad</TableCell>
        <TableCell>Link Propiedad</TableCell>
        <TableCell>Precio Propiedad</TableCell>
        <TableCell>Ubicación Propiedad</TableCell>
        <TableCell>Tipo Propiedad</TableCell>
        <TableCell>Zonas</TableCell>
        <TableCell>Presupuesto</TableCell>
        <TableCell>Cantidad Anuncios</TableCell>
        <TableCell>Contactos</TableCell>
        <TableCell>Inicio Búsqueda</TableCell>
        <TableCell>Área Total</TableCell>
        <TableCell>Área Cubierta</TableCell>
        <TableCell>Baños</TableCell>
        <TableCell>Recámaras</TableCell>
        <TableCell>Nuevo</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {data.map((row, index) => (
            <TableRow key={index}>
            <TableCell>{row.fuente}</TableCell>
            <TableCell>{row.fecha_lead}</TableCell>
            <TableCell>{row.fecha}</TableCell>
            <TableCell>{row.nombre}</TableCell>
            <TableCell><Link href={row.link} target="_blank" rel="noopener noreferrer">{row.link}</Link></TableCell>
            <TableCell>{row.telefono}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.cotizacion}</TableCell>
            <TableCell>{row.asesor.name}</TableCell>
            <TableCell>{row.asesor.phone}</TableCell>
            <TableCell>{row.asesor.email}</TableCell>
            <TableCell>{row.propiedad.titulo}</TableCell>
            <TableCell><Link href={row.propiedad.link} target="_blank" rel="noopener noreferrer">{row.propiedad.link}</Link></TableCell>
            <TableCell>{row.propiedad.precio}</TableCell>
            <TableCell>{row.propiedad.ubicacion}</TableCell>
            <TableCell>{row.propiedad.tipo}</TableCell>
            <TableCell>{row.busquedas.zonas}</TableCell>
            <TableCell>{row.busquedas.presupuesto}</TableCell>
            <TableCell>{row.busquedas.cantidad_anuncios}</TableCell>
            <TableCell>{row.busquedas.contactos}</TableCell>
            <TableCell>{row.busquedas.inicio_busqueda}</TableCell>
            <TableCell>{row.busquedas.total_area}</TableCell>
            <TableCell>{row.busquedas.covered_area}</TableCell>
            <TableCell>{row.busquedas.banios}</TableCell>
            <TableCell>{row.busquedas.recamaras}</TableCell>
            <TableCell>{row.is_new ? 'Sí' : 'No'}</TableCell>
            </TableRow>
        ))}
        </TableBody>
        </Table>
        </TableContainer>
    );
};

export default DataTable;
