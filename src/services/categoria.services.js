import axios from 'axios';
import { config } from '../config';

const API_URL_CATEGORIAS = config.urlCategorias;

// Función para registrar una categoría
export const registrarCategoria = async (categoria) => {
  try {
    const response = await axios.post(API_URL_CATEGORIAS, categoria);
    return response.data;
  } catch (error) {
    console.error('Error en registrarCategoria:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para obtener la lista de categorías
export const obtenerCategorias = async (usuario_id) => {
  try {
    const response = await axios.get(API_URL_CATEGORIAS, {
      params: { usuario_id }
    }
    );
    return response.data;
  } catch (error) {
    console.error('Error en obtenerCategorias:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para obtener una categoría por ID
export const obtenerCategoriaPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL_CATEGORIAS}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerCategoriaPorId:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para actualizar una categoría
export const actualizarCategoria = async (id, categoria) => {
  try {
    const response = await axios.put(`${API_URL_CATEGORIAS}/${id}`, categoria);
    return response.data;
  } catch (error) {
    console.error('Error en actualizarCategoria:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para eliminar una categoría
export const eliminarCategoria = async (id) => {
  try {
    const response = await axios.delete(`${API_URL_CATEGORIAS}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en eliminarCategoria:', error.response ? error.response.data : error.message);
    throw error;
  }
};
