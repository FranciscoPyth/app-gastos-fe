import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { obtenerGastos, eliminarGasto, actualizarGasto } from '../../services/gastos.services';
import { obtenerCategorias } from '../../services/categoria.services';
import { obtenerTipoTransaccion } from '../../services/tipoTransaccion.services';
import { obtenerMediosPago } from '../../services/metodoPago.services';
import { obtenerDivisa } from '../../services/divisa.services';
import { Modal, Button, Form } from 'react-bootstrap';
import { parseJwt } from '../parseJWT.ts';
import '../../styles/Gastos.css';

const formatDate = (date) => {
  const parsedDate = new Date(date);
  const day = String(parsedDate.getUTCDate()).padStart(2, '0'); // Día con dos dígitos
  const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0'); // Mes con dos dígitos (0-11, por lo que sumamos 1)
  const year = parsedDate.getUTCFullYear(); // Año
  return `${day}/${month}/${year}`;
};

const formatMonto = (value) => {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);
};


const ListarGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tiposTransaccion, setTiposTransaccion] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [divisas, setDivisas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedGasto, setSelectedGasto] = useState(null);
  const [formValues, setFormValues] = useState({
    descripcion: '',
    monto: '',
    fecha: '',
    divisa: '',
    tipotransaccion: '',
    metodopago: '',
    categoria: ''
  });

  // Nuevas variables de estado para los filtros
  const [filtroDescripcion, setFiltroDescripcion] = useState('');
  const [filtroMonto, setFiltroMonto] = useState({ min: '', max: '' });
  const [filtroTipoTransaccion, setFiltroTipoTransaccion] = useState('');
  const [filtroFechaRango, setFiltroFechaRango] = useState({ inicio: '', fin: '' });
  
  const [usuario_id, setUsuario] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        const decodedToken = parseJwt(token);
        setUsuario(decodedToken.id);
      }

      if (usuario_id) {
        try {
          const [gastosData, categoriasData, tiposTransaccionData, metodosPagoData, divisasData] = await Promise.all([
            obtenerGastos(usuario_id),
            obtenerCategorias(usuario_id),
            obtenerTipoTransaccion(usuario_id),
            obtenerMediosPago(usuario_id),
            obtenerDivisa(usuario_id)
          ]);
          setGastos(gastosData);
          setCategorias(categoriasData);
          setTiposTransaccion(tiposTransaccionData);
          setMetodosPago(metodosPagoData);
          setDivisas(divisasData);
        } catch (error) {
          console.error('Error al cargar los datos:', error);
        }
      }
    };

    fetchData();
  }, [token, usuario_id]);

  // Función para manejar los filtros
  const filtrarGastos = () => {
    let filtrados = gastos;

    if (filtroDescripcion.trim()) {
      filtrados = filtrados.filter((gasto) =>
        gasto.descripcion.toLowerCase().includes(filtroDescripcion.toLowerCase())
      );
    }

    if (filtroMonto.min) {
      filtrados = filtrados.filter((gasto) => gasto.monto >= parseFloat(filtroMonto.min));
    }

    if (filtroMonto.max) {
      filtrados = filtrados.filter((gasto) => gasto.monto <= parseFloat(filtroMonto.max));
    }

    if (filtroTipoTransaccion) {
      filtrados = filtrados.filter((gasto) => gasto.tipostransaccion_id === parseInt(filtroTipoTransaccion));
    }

    if (filtroFechaRango.inicio) {
      filtrados = filtrados.filter((gasto) => new Date(gasto.fecha) >= new Date(filtroFechaRango.inicio));
    }

    if (filtroFechaRango.fin) {
      filtrados = filtrados.filter((gasto) => new Date(gasto.fecha) <= new Date(filtroFechaRango.fin));
    }

    return filtrados;
  };

  const handleEliminarGasto = async (id) => {
    try {
      await eliminarGasto(id);
      setGastos(gastos.filter((gasto) => gasto.id !== id));
    } catch (error) {
      console.error(`Error al eliminar el gasto con ID ${id}:`, error);
    }
  };

  const handleShowModal = (type, gasto) => {
    setModalType(type);
    setSelectedGasto(gasto);
    setFormValues({
      descripcion: gasto.descripcion,
      monto: gasto.monto,
      fecha: gasto.fecha,
      divisa: gasto.divisa_id,
      tipotransaccion: gasto.tipostransaccion_id,
      metodopago: gasto.metodopago_id,
      categoria: gasto.categoria_id
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGasto(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSaveChanges = async () => {
    try {
      if (selectedGasto) {
        const updatedGasto = {
          ...selectedGasto,
          ...formValues
        };
        await actualizarGasto(updatedGasto.id, updatedGasto);
        setGastos(gastos.map(gasto => gasto.id === updatedGasto.id ? updatedGasto : gasto));
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const exportToExcel = () => {
    // Formatear los datos para el archivo Excel
    const data = filtrarGastos().map((gasto) => ({
      Fecha: formatDate(gasto.fecha),
      Mes: new Date(gasto.fecha).toLocaleString('es-ES', { month: 'long' }), // Obtiene el nombre del mes
      Categoría: categorias.find((categoria) => categoria.id === gasto.categoria_id)?.descripcion || 'N/A',
      Descripción: gasto.descripcion,
      "Medio de Pago": metodosPago.find((metodo) => metodo.id === gasto.metodopago_id)?.descripcion || 'N/A',
      Moneda: divisas.find((divisa) => divisa.id === gasto.divisa_id)?.descripcion || 'N/A',
      Monto: formatMonto(gasto.monto),
    }));    

    // Crear un libro de trabajo
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gastos');

    // Descargar el archivo
    XLSX.writeFile(workbook, 'movimientos.xlsx');
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        {/* Filtros */}
        <div className="mb-3 d-flex justify-content-between">
          <div className="me-3">
            <label htmlFor="filtroDescripcion" className="form-label">
              Filtrar por Descripción
            </label>
            <input
              id="filtroDescripcion"
              type="text"
              className="form-control"
              value={filtroDescripcion}
              onChange={(e) => setFiltroDescripcion(e.target.value)}
              placeholder="Ingrese una descripción"
            />
          </div>
          <div className="me-3">
            <label htmlFor="filtroMontoMin" className="form-label">
              Monto Mínimo
            </label>
            <input
              id="filtroMontoMin"
              type="number"
              className="form-control"
              value={filtroMonto.min}
              onChange={(e) => setFiltroMonto({ ...filtroMonto, min: e.target.value })}
              placeholder="Monto mínimo"
            />
          </div>
          <div className="me-3">
            <label htmlFor="filtroMontoMax" className="form-label">
              Monto Máximo
            </label>
            <input
              id="filtroMontoMax"
              type="number"
              className="form-control"
              value={filtroMonto.max}
              onChange={(e) => setFiltroMonto({ ...filtroMonto, max: e.target.value })}
              placeholder="Monto máximo"
            />
          </div>
          <div className="me-3">
            <label htmlFor="filtroTipoTransaccion" className="form-label">
              Tipo de Transacción
            </label>
            <select
              id="filtroTipoTransaccion"
              className="form-control"
              value={filtroTipoTransaccion}
              onChange={(e) => setFiltroTipoTransaccion(e.target.value)}
            >
              <option value="">Seleccionar tipo</option>
              {tiposTransaccion.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className="me-3">
            <label htmlFor="filtroFechaInicio" className="form-label">
              Fecha Inicio
            </label>
            <input
              id="filtroFechaInicio"
              type="date"
              className="form-control"
              value={filtroFechaRango.inicio}
              onChange={(e) => setFiltroFechaRango({ ...filtroFechaRango, inicio: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="filtroFechaFin" className="form-label">
              Fecha Fin
            </label>
            <input
              id="filtroFechaFin"
              type="date"
              className="form-control"
              value={filtroFechaRango.fin}
              onChange={(e) => setFiltroFechaRango({ ...filtroFechaRango, fin: e.target.value })}
            />
          </div>
        </div>
        
        <div className="table-responsive custom-table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrarGastos().map((gasto) => (
                <tr key={gasto.id}>
                  <td>{gasto.descripcion}</td>
                  <td>{formatMonto(gasto.monto)}</td>
                  <td>{formatDate(gasto.fecha)}</td>
                  <td className="align-middle">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Consultar"
                        onClick={() => handleShowModal('consultar', gasto)}
                      >
                        <i className="fa fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Modificar"
                        onClick={() => handleShowModal('editar', gasto)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Eliminar"
                        onClick={() => handleEliminarGasto(gasto.id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          {/* Botones a la izquierda */}
          <div>
            <Link to="/inicio" className="btn btn-outline-primary me-2">
              <i className="fa fa-home me-1"></i> Volver a Inicio
            </Link>
            <Link to="/registro" className="btn btn-outline-success">
              <i className="fa fa-plus me-1"></i> Registrar Movimiento
            </Link>
          </div>

          {/* Botón de exportación a la derecha */}
          <button
            className="btn btn-success export-btn"
            onClick={exportToExcel}
          >
            <i className="fa fa-download me-1"></i> Exportar a Excel
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'consultar' ? 'Consultar Movimiento' : 'Editar Movimiento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scroll">
          {selectedGasto && (
            <Form>
              <Form.Group className="mb-3" controlId="formDescripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  readOnly={modalType === 'consultar'}
                  value={formValues.descripcion}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formMonto">
                <Form.Label>Monto</Form.Label>
                <Form.Control
                  type="number"
                  name="monto"
                  readOnly={modalType === 'consultar'}
                  value={formValues.monto}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formFecha">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  readOnly={modalType === 'consultar'}
                  value={formValues.fecha}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formDivisa">
                <Form.Label>Divisa</Form.Label>
                {modalType === 'consultar' ? (
                  <Form.Control
                    type="text"
                    value={divisas.find(divisa => divisa.id === formValues.divisa)?.descripcion || ''}
                    readOnly
                  />
                ) : (
                  <Form.Control
                    as="select"
                    name="divisa"
                    value={formValues.divisa}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar divisa</option>
                    {divisas.map(divisa => (
                      <option key={divisa.id} value={divisa.id}>
                        {divisa.descripcion}
                      </option>
                    ))}
                  </Form.Control>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTipoTransaccion">
                <Form.Label>Tipo de Transacción</Form.Label>
                {modalType === 'consultar' ? (
                  <Form.Control
                    type="text"
                    value={tiposTransaccion.find(tipo => tipo.id === formValues.tipotransaccion)?.descripcion || ''}
                    readOnly
                  />
                ) : (
                  <Form.Control
                    as="select"
                    name="tipotransaccion"
                    value={formValues.tipotransaccion}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar tipo de transacción</option>
                    {tiposTransaccion.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.descripcion}
                      </option>
                    ))}
                  </Form.Control>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formMetodoPago">
                <Form.Label>Metodo de Pago</Form.Label>
                {modalType === 'consultar' ? (
                  <Form.Control
                    type="text"
                    value={metodosPago.find(metodo => metodo.id === formValues.metodopago)?.descripcion || ''}
                    readOnly
                  />
                ) : (
                  <Form.Control
                    as="select"
                    name="metodopago"
                    value={formValues.metodopago}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar metodo de pago</option>
                    {metodosPago.map(metodo => (
                      <option key={metodo.id} value={metodo.id}>
                        {metodo.descripcion}
                      </option>
                    ))}
                  </Form.Control>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCategoria">
                <Form.Label>Categoría</Form.Label>
                {modalType === 'consultar' ? (
                  <Form.Control
                    type="text"
                    value={categorias.find(categoria => categoria.id === formValues.categoria)?.descripcion || ''}
                    readOnly
                  />
                ) : (
                  <Form.Control
                    as="select"
                    name="categoria"
                    value={formValues.categoria}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.descripcion}
                      </option>
                    ))}
                  </Form.Control>
                )}
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          {modalType === 'editar' && (
            <Button variant="primary" onClick={handleSaveChanges}>
              Guardar Cambios
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListarGastos;
