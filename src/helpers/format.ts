// helpers/format.js
export const formatDate = (date) => {
    const parsedDate = new Date(date);
    const day = String(parsedDate.getUTCDate()).padStart(2, "0");
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
    const year = parsedDate.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };
  
  export const formatMonto = (value) => {
    console.log(value);
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };