// EditarGasto.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerGastoPorId, actualizarGasto } from '../../services/gastos.services';

const EditarGasto = () => {
  const { id } = useParams();
  const [gasto, setGasto] = useState(null);

  useEffect(() => {
    const cargarGasto = async () => {
      try {
        const data = await obtenerGastoPorId(id);
        setGasto(data);
      } catch (error) {
        console.error('Error al cargar el gasto:', error);
      }
    };
    cargarGasto();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGasto({ ...gasto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarGasto(gasto);
      // Redirigir o mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error al actualizar el gasto:', error);
    }
  };

  if (!gasto) return <div>Cargando...</div>;

  return (
    <div className="container">
      <h2>Editar Gasto</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Descripción</label>
          <input
            type="text"
            className="form-control"
            name="descripcion"
            value={gasto.descripcion}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Monto</label>
          <input
            type="number"
            className="form-control"
            name="monto"
            value={gasto.monto}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Fecha</label>
          <input
            type="date"
            className="form-control"
            name="fecha"
            value={gasto.fecha}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarGasto;
