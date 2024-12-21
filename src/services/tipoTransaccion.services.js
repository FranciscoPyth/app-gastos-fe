import axios from 'axios';
import { config } from '../config';

const API_URL_TIPO_TRANSACCION = config.urlTipoTransacciones;

// Función para registrar un tipo de transacción
export const registrarTipoTransaccion = async (tipoTransaccion) => {
  try {
    const response = await axios.post(API_URL_TIPO_TRANSACCION, tipoTransaccion);
    return response.data;
  } catch (error) {
    console.error('Error en registrarTipoTransaccion:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para obtener la lista de tipos de transacción
export const obtenerTipoTransaccion = async (usuario_id) => {
  try {
    console.log('Obtener tipos de transacción', usuario_id);
    const response = await axios.get(API_URL_TIPO_TRANSACCION, {
      params: { usuario_id }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener un tipo de transacción por ID
export const obtenerTipoTransaccionPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL_TIPO_TRANSACCION}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerTipoTransaccionPorId:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para actualizar un tipo de transacción
export const actualizarTipoTransaccion = async (id, tipoTransaccion) => {
  try {
    const response = await axios.put(`${API_URL_TIPO_TRANSACCION}/${id}`, tipoTransaccion);
    return response.data;
  } catch (error) {
    console.error('Error en actualizarTipoTransaccion:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para eliminar un tipo de transacción
export const eliminarTipoTransaccion = async (id) => {
  try {
    await axios.delete(`${API_URL_TIPO_TRANSACCION}/${id}`);
  } catch (error) {
    console.error('Error en eliminarTipoTransaccion:', error.response ? error.response.data : error.message);
    throw error;
  }
};
