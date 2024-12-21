// ObservarGasto.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerGastoPorId } from '../../services/gastos.services';

const ObservarGasto = () => {
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

  if (!gasto) return <div>Cargando...</div>;

  return (
    <div className="container">
      <h2>Detalle del Gasto</h2>
      <p><strong>ID:</strong> {gasto.id}</p>
      <p><strong>Descripción:</strong> {gasto.descripcion}</p>
      <p><strong>Monto:</strong> ${gasto.monto}</p>
      <p><strong>Fecha:</strong> {gasto.fecha}</p>
    </div>
  );
};

export default ObservarGasto;
