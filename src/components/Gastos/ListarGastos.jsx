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
    const data = gastos.map((gasto) => ({
      Descripción: gasto.descripcion,
      Monto: gasto.monto,
      Fecha: formatDate(gasto.fecha),
      Divisa: divisas.find((divisa) => divisa.id === gasto.divisa_id)?.descripcion || 'N/A',
      Tipo_Transacción: tiposTransaccion.find((tipo) => tipo.id === gasto.tipostransaccion_id)?.descripcion || 'N/A',
      Método_Pago: metodosPago.find((metodo) => metodo.id === gasto.metodopago_id)?.descripcion || 'N/A',
      Categoría: categorias.find((categoria) => categoria.id === gasto.categoria_id)?.descripcion || 'N/A',
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
        <div className="table-responsive">
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
              {gastos.map((gasto) => (
                <tr key={gasto.id}>
                  <td>{gasto.descripcion}</td>
                  <td>${gasto.monto}</td>
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
