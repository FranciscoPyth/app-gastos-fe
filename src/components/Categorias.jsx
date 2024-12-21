import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  obtenerCategorias, 
  registrarCategoria, 
  obtenerCategoriaPorId, 
  actualizarCategoria, 
  eliminarCategoria 
} from '../services/categoria.services';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { parseJwt } from './parseJWT.ts'; // Importa la función parseJWT

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [modo, setModo] = useState('listar'); // listar, editar, eliminar, nuevo
  const [categoriaActual, setCategoriaActual] = useState(null);
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
  
  const cargarCategorias = useCallback(async () => {
    if (userId) {
      try {
        const data = await obtenerCategorias(userId);
        console.log('Categorías:', data);
        setCategorias(data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    }
  }, [userId]);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      const { id: usuario_id } = parseJwt(token); // Extraer el id del usuario del token
      const datosConUsuario = { ...data, usuario_id }; // Agregar el usuario_id a los datos

      if (modo === 'nuevo') {
        console.log('Registrar categoría:', datosConUsuario);
        await registrarCategoria(datosConUsuario);
      } else if (modo === 'editar') {
        console.log('Actualizar categoría:', datosConUsuario);
        console.log('Categoría actual:', categoriaActual);
        console.log('id:', categoriaActual.id);
        await actualizarCategoria(categoriaActual.id, datosConUsuario);
      }
      reset();
      setModo('listar');
      cargarCategorias();
    } catch (error) {
      console.error('Error al registrar/actualizar categoría:', error);
    }
  };

  const handleEditar = async (id) => {
    try {
      const categoria = await obtenerCategoriaPorId(id);
      setCategoriaActual(categoria);
      reset(categoria);
      setModo('editar');
    } catch (error) {
      console.error('Error al obtener la categoría:', error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      const { id: usuario_id } = parseJwt(token); // Extraer el id del usuario del token
      console.log('Eliminar categoría con id:', id, 'por el usuario:', usuario_id);
      await eliminarCategoria(id, { usuario_id }); // Pasar el usuario_id al eliminar
      cargarCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  const handleCancelar = () => {
    reset();
    setModo('listar');
  };

  if (modo === 'listar') {
    return (
      <div className="container mt-5">
        <h2 className="mb-4">Categorías</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(categoria => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.descripcion}</td>
                <td>
                  <button onClick={() => handleEditar(categoria.id)} className="btn btn-light me-2">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleEliminar(categoria.id)} className="btn btn-light text-danger">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setModo('nuevo')} className="btn btn-primary mt-3">Registrar Categoría</button>
        <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => navigate('/registro')}>Volver</button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{modo === 'nuevo' ? 'Registrar Nueva Categoría' : 'Editar Categoría'}</h2>
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

export default Categorias;
