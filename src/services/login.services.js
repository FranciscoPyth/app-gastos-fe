// src/services/login.services.js

import axios from 'axios';
import { config } from '../config';

const API_URL_LOGIN = config.urlLogin;

// Función para iniciar sesión
export const iniciarSesion = async (credenciales) => {
  try {
    const response = await axios.post(API_URL_LOGIN, credenciales);
    console.log('Iniciar sesión:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en iniciarSesion:', error.response ? error.response.data : error.message);
    return error.response.data;
  }
};

// Función para cerrar sesión
export const cerrarSesion = async () => {
  try {
    const response = await axios.delete(API_URL_LOGIN);
    return response.data;
  } catch (error) {
    console.error('Error en cerrarSesion:', error.response ? error.response.data : error.message);
    throw error;
  }
};