import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { registrarGasto } from '../../services/gastos.services';
import { obtenerCategorias } from '../../services/categoria.services';
import { obtenerMediosPago } from '../../services/metodoPago.services';
import { obtenerDivisa } from '../../services/divisa.services';
import { obtenerTipoTransaccion } from '../../services/tipoTransaccion.services';
import { format, parse, isValid } from 'date-fns';
import { parseJwt } from '../parseJWT.ts';

const RegistrarGastos = () => {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [mediosDePago, setMediosDePago] = useState([]);
  const [divisas, setDivisas] = useState([]);
  const [tipoTransacciones, setTipoTransacciones] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [userId, setUserId] = useState(null);

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
    }
  }, [userId]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const [categoriasData, mediosDePagoData, divisasData, tipoTransaccionesData] = await Promise.all([
            obtenerCategorias(userId),
            obtenerMediosPago(userId),
            obtenerDivisa(userId),
            obtenerTipoTransaccion(userId)
          ]);
  
          setCategorias(categoriasData);
          setMediosDePago(mediosDePagoData);
          setDivisas(divisasData);
          setTipoTransacciones(tipoTransaccionesData);
  
          const token = localStorage.getItem('token');
          if (token) {
            const decodedToken = parseJwt(token);
            setUsuario(decodedToken);
            console.log('Usuario:', decodedToken);
          }
        } else {
          console.error('UserId no está definido');
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
  
    fetchData();
  }, [userId]); // Dependencia en userId para asegurarnos de que se ejecute después de establecer userId
  

  const handleDateChange = (event) => {
    const inputDate = parse(event.target.value, 'yyyy-MM-dd', new Date());
    if (isValid(inputDate)) {
      const formattedDate = format(inputDate, 'dd/MM/yyyy');
      setValue('fecha', formattedDate);
    }
  };

  const setTodayDate = () => {
    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yyyy');
    setValue('fecha', formattedDate);
  };

  const onSubmit = async (data) => {
    try {
      data.fecha = format(parse(data.fecha, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd');
      if (usuario && usuario.id) {
        data.usuario_id = usuario.id;
        await registrarGasto(data);
        console.log('Gasto registrado:', data);
        navigate('/lista');
      } else {
        console.error('No se ha encontrado el ID del usuario.');
      }
    } catch (error) {
      console.error('Error al registrar el gasto:', error);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4">Registrar Nuevo Gasto</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="monto" className="form-label">Monto</label>
          <input type="number" step="0.01" className="form-control" id="monto" {...register('monto', { required: true })} />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <input type="text" className="form-control" id="descripcion" {...register('descripcion', { required: true })} />
        </div>
        <div className="mb-3">
          <label htmlFor="fecha" className="form-label">Fecha de la transacción</label>
          <div className="d-flex">
            <input 
              type="text" 
              className="form-control me-2" 
              id="fecha" 
              placeholder="DD/MM/YYYY" 
              onBlur={handleDateChange} 
              {...register('fecha', { required: true })}
            />
            <button type="button" className="btn btn-outline-primary" onClick={setTodayDate}>Hoy</button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="categoria_id" className="form-label">Categoría</label>
          <div className="d-flex">
            <select className="form-select me-2" id="categoria_id" {...register('categoria_id', { required: true })}>
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.descripcion}</option>
              ))}
            </select>
            <button type="button" className="btn btn-outline-primary" onClick={() => navigate('/categorias')}>+</button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="metodopago_id" className="form-label">Medio de Pago</label>
          <div className="d-flex">
            <select className="form-select me-2" id="metodopago_id" {...register('metodopago_id', { required: true })}>
              <option value="">Selecciona un medio de pago</option>
              {mediosDePago.map((medio) => (
                <option key={medio.id} value={medio.id}>{medio.descripcion}</option>
              ))}
            </select>
            <button type="button" className="btn btn-outline-primary" onClick={() => navigate('/medio-pago')}>+</button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="divisa_id" className="form-label">Divisa</label>
          <div className="d-flex">
            <select className="form-select me-2" id="divisa_id" {...register('divisa_id', { required: true })}>
              <option value="">Selecciona una divisa</option>
              {divisas.map((divisa) => (
                <option key={divisa.id} value={divisa.id}>{divisa.descripcion}</option>
              ))}
            </select>
            <button type="button" className="btn btn-outline-primary" onClick={() => navigate('/divisas')}>+</button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="tipostransaccion_id" className="form-label">Tipo Transacción</label>
          <div className="d-flex">
            <select className="form-select me-2" id="tipostransaccion_id" {...register('tipostransaccion_id', { required: true })}>
              <option value="">Selecciona un Tipo de Transacción</option>
              {tipoTransacciones.map((tipoTransaccion) => (
                <option key={tipoTransaccion.id} value={tipoTransaccion.id}>{tipoTransaccion.descripcion}</option>
              ))}
            </select>
            <button type="button" className="btn btn-outline-primary" onClick={() => navigate('/tipo-transaccion')}>+</button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary me-2">Registrar Gasto</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/lista')}>Cancelar</button>
      </form>
    </div>
  );
};

export default RegistrarGastos;
