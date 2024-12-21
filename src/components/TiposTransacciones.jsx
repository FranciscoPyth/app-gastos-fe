import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  obtenerTipoTransaccion, 
  registrarTipoTransaccion, 
  obtenerTipoTransaccionPorId, 
  actualizarTipoTransaccion, 
  eliminarTipoTransaccion 
} from '../services/tipoTransaccion.services';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { parseJwt } from './parseJWT.ts'; // Importar la función para decodificar el token

const TipoTransaccion = () => {
  const [tiposTransaccion, setTiposTransaccion] = useState([]);
  const [modo, setModo] = useState('listar'); // listar, editar, eliminar, nuevo
  const [tipoTransaccionActual, setTipoTransaccionActual] = useState(null);
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID del usuario
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      setUserId(decoded.id);
    }
  }, []); // Dependencias vacías para ejecutar solo una vez al montar
  
  useEffect(() => {
    if (userId) {
      console.log('ID del usuario desde userId:', userId);
      cargarTiposTransaccion();
    }
  }, [userId]);

  const cargarTiposTransaccion = async () => {
    try {
      console.log('USERID:', userId);
      const data = await obtenerTipoTransaccion(userId);
      console.log('Tipos de Transacción:', data);
      setTiposTransaccion(data);
    } catch (error) {
      console.error('Error al obtener tipos de transacción:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const { id: usuario_id } = parseJwt(token); // Extraer el id del usuario del token
      const datosConUsuario = { ...data, usuario_id };

      if (modo === 'nuevo') {
        console.log('Registrar tipo de transacción:', datosConUsuario);
        await registrarTipoTransaccion(datosConUsuario);
      } else if (modo === 'editar') {
        console.log('Actualizar tipo de transacción:', datosConUsuario);
        await actualizarTipoTransaccion(tipoTransaccionActual.id, datosConUsuario);
      }
      reset();
      setModo('listar');
      cargarTiposTransaccion();
    } catch (error) {
      console.error('Error al registrar/actualizar tipo de transacción:', error);
    }
  };

  const handleEditar = async (id) => {
    try {
      const tipoTransaccion = await obtenerTipoTransaccionPorId(id);
      setTipoTransaccionActual(tipoTransaccion);
      reset(tipoTransaccion);
      setModo('editar');
    } catch (error) {
      console.error('Error al obtener el tipo de transacción:', error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      console.log('Eliminar tipo de transacción con id:', id);
      await eliminarTipoTransaccion(id);
      cargarTiposTransaccion();
    } catch (error) {
      console.error('Error al eliminar tipo de transacción:', error);
    }
  };

  const handleCancelar = () => {
    reset();
    setModo('listar');
  };

  if (modo === 'listar') {
    return (
      <div className="container mt-5">
        <h2 className="mb-4">Tipos de Transacción</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tiposTransaccion.map(tipoTransaccion => (
              <tr key={tipoTransaccion.id}>
                <td>{tipoTransaccion.id}</td>
                <td>{tipoTransaccion.descripcion}</td>
                <td>
                  <button onClick={() => handleEditar(tipoTransaccion.id)} className="btn btn-light me-2">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleEliminar(tipoTransaccion.id)} className="btn btn-light text-danger">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setModo('nuevo')} className="btn btn-primary mt-3">Registrar Tipo de Transacción</button>
        <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => navigate('/registro')}>Volver</button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{modo === 'nuevo' ? 'Registrar Nuevo Tipo de Transacción' : 'Editar Tipo de Transacción'}</h2>
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
    </div>
  );
};

export default TipoTransaccion;
