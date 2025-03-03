/*
En este archivo se definen las URL de los servicios REST que se van a consumir. Para
estandarizar un poco más el proceso y no tener que modificar cada archivo que consuma una URL
*/

const urlServidor = "http://localhost:4000"//"http://localhost:4000"// "https://budgeting-server.onrender.com"; // https://vps-4600756-x.dattaweb.com


const urlGastos = urlServidor + "/api/gastos";
const urlDivisas = urlServidor + "/api/divisas";
const urlCategorias = urlServidor + "/api/categorias";
const urlMediosDePago = urlServidor + "/api/metodosPagos";
const urlTipoTransacciones = urlServidor + "/api/tiposTransacciones";
const urlLogin = urlServidor + "/api/login";
const urlAudio = urlServidor + "/api/audio";


export const config = {
    urlServidor,
    urlGastos,
    urlDivisas,
    urlCategorias,
    urlMediosDePago,
    urlTipoTransacciones,
    urlLogin,
    urlAudio
}