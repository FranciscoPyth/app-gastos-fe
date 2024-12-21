import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  obtenerDivisa, 
  registrarDivisa, 
  obtenerDivisaPorId, 
  actualizarDivisa, 
  eliminarDivisa 
} from '../services/divisa.services';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { parseJwt } from './parseJWT.ts'; // Importa la función parseJWT

const Divisa = () => {
  const [divisas, setDivisas] = useState([]);
  const [modo, setModo] = useState('listar');
  const [divisaActual, setDivisaActual] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID del usuario

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      setUserId(decoded.id);
    }
  }, []); // Dependencias vacías para ejecutar solo una vez al montar
  
  const cargarDivisas = useCallback(async () => {
    if (userId) {
      try {
        const data = await obtenerDivisa(userId);
        setDivisas(data);
      } catch (error) {
        console.error('Error al obtener divisas:', error);
      }
    }
  }, [userId]);

  useEffect(() => {
    cargarDivisas();
  }, [cargarDivisas]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const { id: usuario_id } = parseJwt(token); // Extraer el id del usuario del token
      const datosConUsuario = { ...data, usuario_id }; // Agregar el usuario_id a los datos

      if (modo === 'nuevo') {
        await registrarDivisa(datosConUsuario);
      } else if (modo === 'editar') {
        await actualizarDivisa(divisaActual.id, datosConUsuario);
      }
      reset();
      setModo('listar');
      cargarDivisas();
    } catch (error) {
      console.error('Error al registrar/actualizar divisa:', error);
    }
  };

  const handleEditar = async (id) => {
    try {
      const divisa = await obtenerDivisaPorId(id);
      setDivisaActual(divisa);
      reset(divisa);
      setModo('editar');
    } catch (error) {
      console.error('Error al obtener la divisa:', error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarDivisa(id); 
      cargarDivisas();
    } catch (error) {
      console.error('Error al eliminar divisa:', error);
    }
  };

  const handleCancelar = () => {
    reset();
    setModo('listar');
  };

  return (
    <div className="container mt-5">
      {modo === 'listar' ? (
        <>
          <h2 className="mb-4">Divisas</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {divisas.map(divisa => (
                <tr key={divisa.id}>
                  <td>{divisa.id}</td>
                  <td>{divisa.descripcion}</td>
                  <td>
                    <button onClick={() => handleEditar(divisa.id)} className="btn btn-light me-2">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleEliminar(divisa.id)} className="btn btn-light text-danger">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setModo('nuevo')} className="btn btn-primary mt-3">Registrar Divisa</button>
          <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => navigate('/registro')}>Volver</button>
        </>
      ) : (
        <>
          <h2 className="mb-4">{modo === 'nuevo' ? 'Registrar Nueva Divisa' : 'Editar Divisa'}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <input type="text" className="form-control" id="descripcion" {...register('descripcion', { required: true })} />
            </div>
            <div className="d-flex justify-content-start">
              <button type="submit" className="btn btn-primary me-2">{modo === 'nuevo' ? 'Registrar' : 'Actualizar'}</button>
              <button type="button" className="btn btn-secondary me-2" onClick={handleCancelar}>Cancelar</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Divisa;
