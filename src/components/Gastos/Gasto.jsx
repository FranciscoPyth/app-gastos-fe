// Gasto.js

import React from 'react';
import { Link } from 'react-router-dom';

const Gasto = ({ gasto, onDelete }) => {
  const handleEliminarClick = () => {
    onDelete(gasto.id); // Llama a la función onDelete pasando el ID del gasto
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <strong>{gasto.id}</strong> | {gasto.descripcion} | ${gasto.monto} | {gasto.fecha}
      </div>
      <div>
        <Link to={`/editar/${gasto.id}`} className="btn btn-warning me-2">
          <i className="fa fa-edit"></i> Modificar
        </Link>
        <Link to={`/observar/${gasto.id}`} className="btn btn-info me-2">
          <i className="fa fa-eye"></i> Observar
        </Link>
        <button className="btn btn-danger" onClick={handleEliminarClick}>
          <i className="fa fa-trash"></i> Eliminar
        </button>
      </div>
    </li>
  );
};

export default Gasto;
