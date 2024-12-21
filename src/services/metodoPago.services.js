// src/services/apiService.js
import axios from 'axios';
import { config } from '../config';

const API_URL_MEDIOS_PAGO = config.urlMediosDePago;

// Función para registrar una categoría
export const registrarMedioPago = async (medioPago) => {
  try {
    console.log('Registrar medio de pago:', medioPago);
    const response = await axios.post(API_URL_MEDIOS_PAGO, medioPago);
    return response.data;
  } catch (error) {
    console.error('Error en registrarMedioPago:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para obtener la lista de categorías
export const obtenerMediosPago = async (usuario_id) => {
  try {
    const response = await axios.get(API_URL_MEDIOS_PAGO, {
      params: { usuario_id }
    }
    );
    return response.data;
  } catch (error) {
    console.error('Error en obtenerMediosPago:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para obtener una categoría por ID
export const obtenerMedioPagoPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL_MEDIOS_PAGO}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerMedioPagoPorId:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para actualizar una categoría por ID
export const actualizarMedioPago = async (id, medioPago) => {
  try {
    const response = await axios.put(`${API_URL_MEDIOS_PAGO}/${id}`, medioPago);
    return response.data;
  } catch (error) {
    console.error('Error en actualizarMedioPago:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para eliminar una categoría por ID
export const eliminarMedioPago = async (id) => {
  try {
    await axios.delete(`${API_URL_MEDIOS_PAGO}/${id}`);
  } catch (error) {
    console.error('Error en eliminarMedioPago:', error.response ? error.response.data : error.message);
    throw error;
  }
};
