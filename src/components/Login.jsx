// src/components/Login.jsx
import React, { useState } from 'react';
import { iniciarSesion } from '../services/login.services';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Función para traducir errores comunes del backend
  const traducirMensaje = (mensajeOriginal) => {
    switch (mensajeOriginal) {
      case 'Invalid username or password':
        return 'Usuario o contraseña incorrectos';
      case 'User not found':
      case 'Usuario no encontrado':
        return 'Usuario no encontrado';
      case 'Missing fields':
        return 'Por favor, completa todos los campos';
      default:
        return mensajeOriginal || 'Ocurrió un error. Intenta nuevamente.';
    }
  };
  

  // Validación y envío del formulario
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
      toast.error('Por favor, completa todos los campos');
      return;
    }
  
    try {
      const data = await iniciarSesion({ username, password });
  
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/inicio');
      } else {
        const mensajeTraducido = traducirMensaje(data.message);
        toast.error(mensajeTraducido);
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
  
      // Si el backend devuelve un error con formato JSON
      if (error.response?.data?.message) {
        const mensajeTraducido = traducirMensaje(error.response.data.message);
        toast.error(mensajeTraducido);
      } else {
        toast.error('Ocurrió un error durante el inicio de sesión. Por favor, intenta nuevamente.');
      }
    }
  };
  

  return (
    <div className="login-container-unique">
      <form className="login-form-unique" onSubmit={handleLogin}>
        <h2>Aplicación de Gastos</h2>

        <div className="login-form-group-unique">
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="login-form-group-unique">
          <label htmlFor="password">Contraseña:</label>
          <div className="password-input-container" style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-btn"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '5px',
                color: '#666'
              }}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <button type="submit" className="login-btn-primary-unique">Iniciar sesión</button>
        <button 
          type="button" 
          className="btn btn-outline-secondary w-100 mt-2" 
          onClick={() => navigate('/register-user')}
        >
          Registrarme
        </button>
      </form>

      <footer className="login-footer">
        <p>Quiero adquirir más información...</p>
        <a href="https://wa.me/3513244486" target="_blank" rel="noopener noreferrer">
          Envíanos un mensaje por WhatsApp
        </a>
      </footer>

      <ToastContainer 
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Login;
