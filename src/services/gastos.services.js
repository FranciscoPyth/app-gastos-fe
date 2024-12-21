// src/services/gastos.services.js

import axios from 'axios';
import { config } from '../config';

const API_URL_GASTOS = config.urlGastos;

// Función para registrar un nuevo gasto
export const registrarGasto = async (nuevoGasto) => {
  try {
    console.log('Nuevo gasto:', nuevoGasto);
    const response = await axios.post(API_URL_GASTOS, nuevoGasto);
    return response.data;
  } catch (error) {
    console.error('Error en registrarGasto:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para obtener la lista de gastos
export const obtenerGastos = async (usuario_id) => {
  try {
    const response = await axios.get(API_URL_GASTOS, {
        params: { usuario_id }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error en obtenerGastos:', error);
    throw error;
  }
};

// Función para obtener un gasto por su ID
export const obtenerGastoPorId = async (idGasto) => {
  try {
    const response = await axios.get(`${API_URL_GASTOS}/${idGasto}`);
    return response.data;
  } catch (error) {
    console.error(`Error en obtenerGastoPorId con ID ${idGasto}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para actualizar un gasto por su ID
export const actualizarGasto = async (idGasto, datosActualizados) => {
  try {
    const response = await axios.put(`${API_URL_GASTOS}/${idGasto}`, datosActualizados);
    return response.data;
  } catch (error) {
    console.error(`Error en actualizarGasto con ID ${idGasto}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para eliminar un gasto por su ID
export const eliminarGasto = async (idGasto) => {
  try {
    const response = await axios.delete(`${API_URL_GASTOS}/${idGasto}`);
    return response.data;
  } catch (error) {
    console.error(`Error en eliminarGasto con ID ${idGasto}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};
