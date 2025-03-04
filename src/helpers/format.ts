// helpers/format.js
export const formatDate = (date) => {
    const parsedDate = new Date(date);
    const day = String(parsedDate.getUTCDate()).padStart(2, "0");
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
    const year = parsedDate.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };
  
export const formatMonto = (value) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
};

export const formatMontoExport = (value) => {
  // Convertimos a número si viene como string
  const parsedValue = typeof value === "number" ? value : parseFloat(value);

  if (isNaN(parsedValue)) {
    console.warn("formatMonto recibió un valor no numérico:", value);
    return "N/A";
  }

  return parsedValue.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};