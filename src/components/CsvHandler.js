export const exportTableToCSV = (columns, data) => {
    // Construir encabezado del CSV
    const header = columns.map((col) => col.title).join(',');
  
    // Construir filas del CSV
    const rows = data.map((row) =>
      columns
        .map((col) => {
          // Manejar campos anidados
          if (Array.isArray(col.dataIndex)) {
            return col.dataIndex.reduce((value, key) => (value ? value[key] : ''), row);
          }
          // Campos simples
          return col.dataIndex ? row[col.dataIndex] || '' : '';
        })
        .join(',') // Unir valores en una fila
    );
  
    // Combinar encabezado y filas
    const csv = [header, ...rows].join('\n');
  
    // Crear archivo Blob y descargar
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'table-data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };