// src/components/ConsultarGastos.jsx
import React, { useState } from 'react';
import { obtenerGastosPorTelefono } from '../services/gastos.services';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatMonto } from '../helpers/format.ts';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Login.css';
import '../styles/Gastos.css';

const ConsultarGastos = () => {
  const [telefono, setTelefono] = useState('');
  const [datosConsulta, setDatosConsulta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consultaRealizada, setConsultaRealizada] = useState(false);
  const navigate = useNavigate();

  const handleConsulta = async (e) => {
    e.preventDefault();
    
    if (!telefono.trim()) {
      toast.error('Por favor, ingresa un número de teléfono');
      return;
    }

    setLoading(true);
    try {
      const data = await obtenerGastosPorTelefono(telefono);
      setDatosConsulta(data);
      setConsultaRealizada(true);
      
      if (data.gastos && data.gastos.length === 0) {
        toast.info('No se encontraron gastos para este número de teléfono');
      } else if (data.gastos && data.gastos.length > 0) {
        toast.success(`Se encontraron ${data.total_gastos} gastos`);
      }
    } catch (error) {
      console.error('Error al consultar gastos:', error);
      
      if (error.response?.status === 404) {
        toast.error('No se encontraron gastos para este número de teléfono');
        setDatosConsulta({ gastos: [], total_gastos: 0 });
        setConsultaRealizada(true);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al consultar los gastos. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const volverAlLogin = () => {
    navigate('/');
  };

  const nuevaConsulta = () => {
    setTelefono('');
    setDatosConsulta(null);
    setConsultaRealizada(false);
  };

  return (
    <div className="login-container-unique">
      <div className="login-form-unique" style={{ maxWidth: '800px', width: '90%' }}>
        {!consultaRealizada ? (
          <>
            <h2>Consultar Gastos</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
              Ingresa tu número de teléfono para consultar tus gastos
            </p>

            <form onSubmit={handleConsulta}>
              <div className="login-form-group-unique">
                <label htmlFor="telefono">Número de teléfono:</label>
                <input
                  type="tel"
                  id="telefono"
                  placeholder="Ej: 3513244486"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="login-btn-primary-unique"
                disabled={loading}
              >
                {loading ? 'Consultando...' : 'Consultar Gastos'}
              </button>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button 
                  type="button" 
                  className="btn btn-link" 
                  onClick={volverAlLogin}
                  style={{ color: '#007bff', textDecoration: 'underline' }}
                >
                  ← Volver al login
                </button>
              </div>
            </form>
          </>
        ) : (
          <div>

            {datosConsulta && datosConsulta.gastos && datosConsulta.gastos.length > 0 && (
              <div>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                  Tus movimientos registrados
                </h3>
                
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Descripción</th>
                        <th>Monto</th>
                        <th>Categoría</th>
                        <th>Método de Pago</th>
                        <th>Tipo Transacción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosConsulta.gastos.map((gasto) => (
                        <tr key={gasto.id}>
                          <td>{formatDate(gasto.fecha)}</td>
                          <td>{gasto.descripcion}</td>
                          <td>{formatMonto(gasto.monto, gasto.Divisa?.simbolo || '$')}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {gasto.Categoria?.nombre || 'Sin categoría'}
                            </span>
                          </td>
                          <td>{gasto.MetodosPago?.nombre || 'No especificado'}</td>
                          <td>
                            <span className="badge bg-info">
                              {gasto.TiposTransacciones?.nombre || 'No especificado'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <div className="alert alert-info">
                    <strong>Total de movimientos: {datosConsulta.total_gastos}</strong>
                  </div>
                </div>
              </div>
            )}

            {datosConsulta && (!datosConsulta.gastos || datosConsulta.gastos.length === 0) && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <div className="alert alert-warning">
                  <h4>No se encontraron gastos</h4>
                  <p>No hay gastos registrados para este número de teléfono.</p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={nuevaConsulta}
                className="btn btn-outline-secondary"
                style={{ flex: 1 }}
              >
                Nueva Consulta
              </button>
              <button 
                onClick={volverAlLogin}
                className="btn btn-outline-primary"
                style={{ flex: 1 }}
              >
                Volver al Login
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="login-footer">
        <p>¿Necesitas ayuda?</p>
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

export default ConsultarGastos;