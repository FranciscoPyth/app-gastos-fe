import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Menu.css'; // Asegúrate de importar tu archivo CSS

function Menu() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-md">
      <div className="container-fluid">
        <a className="navbar-brand" href="#!">
          <i className="fa"></i>
          <span>Gestión de Gastos</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/inicio">
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/registro">
                Registrar gasto
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/lista">
                Lista de gastos
              </NavLink>
            </li>
            <li className="nav-item ml-auto d-none d-md-block">
              <button className="nav-link btn btn-link logout-button" onClick={logout}>
                <i className="fas fa-sign-out-alt"></i> {/* Ícono de logout */}
              </button>
            </li>
            <li className="nav-item d-md-none">
              <button className="nav-link btn btn-link logout-text" onClick={logout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export { Menu };
