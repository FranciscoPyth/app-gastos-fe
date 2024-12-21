import axios from 'axios';
import { config } from '../config';

const API_URL_DIVISAS = config.urlDivisas;

// Función para registrar una divisa
export const registrarDivisa = async (divisa) => {
  try {
    const response = await axios.post(API_URL_DIVISAS, divisa);
    return response.data;
  } catch (error) {
    console.error('Error en registrarDivisa:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para obtener la lista de divisas
export const obtenerDivisa = async (usuario_id) => {
  try {
    const response = await axios.get(API_URL_DIVISAS, {
      params: { usuario_id }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener una divisa por ID
export const obtenerDivisaPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL_DIVISAS}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerDivisaPorId:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para actualizar una divisa
export const actualizarDivisa = async (id, divisa) => {
  try {
    const response = await axios.put(`${API_URL_DIVISAS}/${id}`, divisa);
    return response.data;
  } catch (error) {
    console.error('Error en actualizarDivisa:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para eliminar una divisa
export const eliminarDivisa = async (id) => {
  try {
    await axios.delete(`${API_URL_DIVISAS}/${id}`);
  } catch (error) {
    console.error('Error en eliminarDivisa:', error.response ? error.response.data : error.message);
    throw error;
  }
};
