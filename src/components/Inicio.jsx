// src/components/Inicio.jsx
import React from 'react';
import { Link } from "react-router-dom";

function Inicio() {

    return (
        <div className="container mt-4">
            <div className="card p-4">
                <h1 className="card-title">Sistema de Gestión de Gastos</h1>
                <p>Este proyecto de gestión de gastos está desarrollado utilizando las siguientes tecnologías:</p>
                <ul>
                    <li>Backend: Node.js, Express, RESTful APIs, Sequelize, SQLite, arquitectura de múltiples capas en JavaScript.</li>
                    <li>Frontend: Single Page Application, HTML, CSS, Bootstrap, JavaScript, Node.js y React.</li>
                </ul>
                <p>El sistema permite registrar y administrar gastos de manera eficiente, proporcionando herramientas para visualizar y gestionar los gastos de forma organizada y eficaz.</p>
                <div className="d-grid gap-3">
                    <Link to="/lista" className="btn btn-primary btn-lg">
                        <i className="fa fa-search me-2"></i> Ver lista de gastos
                    </Link>
                    <Link to="/registro" className="btn btn-primary btn-lg">
                        <i className="fa fa-plus me-2"></i> Registrar nuevo gasto
                    </Link>
                </div>
            </div>
        </div>
    );
}

export { Inicio };
