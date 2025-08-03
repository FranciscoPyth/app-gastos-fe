import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importar los estilos
import { registrarUsuario } from '../../services/login.services';

const RegisterUser = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateInputs = () => {
        let newErrors = {};
        if (formData.username.length < 3) {
            newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres.";
        }
        if (formData.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Por favor, ingresa un correo electrónico válido.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;
    
        try {
            // Llamada asíncrona a la API para registrar el usuario
            const data = await registrarUsuario(formData);
    
            // Verificamos si la respuesta tiene un mensaje de éxito
            if (data && data.message) { // Asumiendo que tu API devuelve un campo 'success'
                console.log('Usuario registrado:', data);
                toast.success('¡Usuario registrado con éxito!');
                
                // Opcional: redirigir al login después de un registro exitoso
                setTimeout(() => navigate('/'), 2000);
            } else {
                toast.error(data.message || 'Error al registrar el usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error en el servidor. Por favor, intenta más tarde.');
        }
    };
        

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            {/* Contenedor de Toast */}
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            
            <div className="card p-4 shadow" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">Registrar Usuario</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label className="form-label">Nombre de usuario</label>
                        <input
                            type="text"
                            name="username"
                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Registrar</button>
                    <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={() => navigate('/')}>
                        Volver a Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterUser;