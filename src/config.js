/*
En este archivo se definen las URL de los servicios REST que se van a consumir. Para
estandarizar un poco más el proceso y no tener que modificar cada archivo que consuma una URL
*/

const urlServidor = "https://app-gastos-ba.onrender.com"//"http://localhost:4000"// "https://budgeting-server.onrender.com";


const urlGastos = urlServidor + "/api/gastos";
const urlDivisas = urlServidor + "/api/divisas";
const urlCategorias = urlServidor + "/api/categorias";
const urlMediosDePago = urlServidor + "/api/metodosPagos";
const urlTipoTransacciones = urlServidor + "/api/tiposTransacciones";
const urlLogin = urlServidor + "/api/login";


export const config = {
    urlServidor,
    urlGastos,
    urlDivisas,
    urlCategorias,
    urlMediosDePago,
    urlTipoTransacciones,
    urlLogin
}