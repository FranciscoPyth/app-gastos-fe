import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registrarGasto } from "../../services/gastos.services";
import { obtenerCategorias } from "../../services/categoria.services";
import { obtenerMediosPago } from "../../services/metodoPago.services";
import { obtenerDivisa } from "../../services/divisa.services";
import { obtenerTipoTransaccion } from "../../services/tipoTransaccion.services";
import { format, parse, isValid } from "date-fns";
import { parseJwt } from "../parseJWT.ts";

const RegistrarGastos = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([
    { id: "", descripcion: "Cargando..." },
  ]);
  const [mediosDePago, setMediosDePago] = useState([
    { id: "", descripcion: "Cargando..." },
  ]);
  const [divisas, setDivisas] = useState([
    { id: "", descripcion: "Cargando..." },
  ]);
  const [tipoTransacciones, setTipoTransacciones] = useState([
    { id: "", descripcion: "Cargando..." },
  ]);

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      setUserId(decoded.id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const [
          categoriasData,
          mediosDePagoData,
          divisasData,
          tipoTransaccionesData,
        ] = await Promise.all([
          obtenerCategorias(userId),
          obtenerMediosPago(userId),
          obtenerDivisa(userId),
          obtenerTipoTransaccion(userId),
        ]);

        setCategorias(categoriasData);
        setMediosDePago(mediosDePagoData);
        setDivisas(divisasData);
        setTipoTransacciones(tipoTransaccionesData);

        // Configuración de valores predeterminados
        const tipoTransaccionPredefinido = tipoTransaccionesData.find(
          (t) => t.descripcion === "Egreso"
        );
        const categoriaPredefinida = categoriasData.find(
          (c) => c.descripcion === "Salidas"
        );
        const medioPagoPredefinido = mediosDePagoData.find(
          (m) => m.descripcion === "Efectivo"
        );
        const divisaPredefinida = divisasData.find(
          (d) => d.descripcion === "ARS"
        );

        const fechaActual = format(new Date(), "dd/MM/yyyy");

        if (tipoTransaccionPredefinido)
          setValue("tipostransaccion_id", tipoTransaccionPredefinido.id);
        if (categoriaPredefinida)
          setValue("categoria_id", categoriaPredefinida.id);
        if (medioPagoPredefinido)
          setValue("metodopago_id", medioPagoPredefinido.id);
        if (divisaPredefinida) setValue("divisa_id", divisaPredefinida.id);
        setValue("fecha", fechaActual);
        setLoading(false); // Indicar que los datos están listos
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const onSubmit = async (data) => {
    try {
      data.fecha = format(
        parse(data.fecha, "dd/MM/yyyy", new Date()),
        "yyyy-MM-dd"
      );
      if (userId) {
        // Usar userId en lugar de usuario
        data.usuario_id = userId;
        await registrarGasto(data);
        console.log("Movimiento registrado:", data);
        navigate("/lista");
      } else {
        console.error("No se ha encontrado el ID del usuario.");
      }
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="tipostransaccion_id" className="form-label">
            Tipo Transacción
          </label>
          <div className="d-flex">
            <select
              className="form-select me-2"
              id="tipostransaccion_id"
              {...register("tipostransaccion_id", { required: true })}
            >
              <option value="">Selecciona un Tipo de Transacción</option>
              {tipoTransacciones.map((tipoTransaccion) => (
                <option key={tipoTransaccion.id} value={tipoTransaccion.id}>
                  {tipoTransaccion.descripcion}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => navigate("/tipo-transaccion")}
            >
              +
            </button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="monto" className="form-label">
            Monto
          </label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            id="monto"
            placeholder="Ingrese el monto"
            {...register("monto", {
              required: "El monto es obligatorio.",
              min: {
                value: 0.01,
                message: "El monto debe ser mayor a 0.",
              },
              validate: (value) => {
                if (isNaN(value)) return "El monto debe ser un número válido.";
                return true;
              },
            })}
          />
          {errors.monto && (
            <span className="text-danger">{errors.monto.message}</span>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">
            Descripción
          </label>
          <input
            type="text"
            className="form-control"
            id="descripcion"
            {...register("descripcion", { required: true })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="fecha" className="form-label">
            Fecha de la transacción
          </label>
          <input
            type="text"
            className={`form-control ${errors.fecha ? "is-invalid" : ""}`}
            id="fecha"
            placeholder="DD/MM/YYYY"
            {...register("fecha", {
              required: "La fecha es obligatoria.",
              pattern: {
                value: /^\d{2}\/\d{2}\/\d{4}$/,
                message: "El formato debe ser DD/MM/YYYY.",
              },
              validate: (value) =>
                isValid(parse(value, "dd/MM/yyyy", new Date())) ||
                "La fecha no es válida.",
            })}
          />
          {errors.fecha && (
            <div className="invalid-feedback">{errors.fecha.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="categoria_id" className="form-label">
            Categoría
          </label>
          <div className="d-flex">
            <select
              className="form-select me-2"
              id="categoria_id"
              {...register("categoria_id", { required: true })}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.descripcion}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => navigate("/categorias")}
            >
              +
            </button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="metodopago_id" className="form-label">
            Medio de Pago
          </label>
          <div className="d-flex">
            <select
              className="form-select me-2"
              id="metodopago_id"
              {...register("metodopago_id", { required: true })}
            >
              <option value="">Selecciona un medio de pago</option>
              {mediosDePago.map((medio) => (
                <option key={medio.id} value={medio.id}>
                  {medio.descripcion}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => navigate("/medio-pago")}
            >
              +
            </button>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="divisa_id" className="form-label">
            Divisa
          </label>
          <div className="d-flex">
            <select
              className="form-select me-2"
              id="divisa_id"
              {...register("divisa_id", { required: true })}
            >
              <option value="">Selecciona una divisa</option>
              {divisas.map((divisa) => (
                <option key={divisa.id} value={divisa.id}>
                  {divisa.descripcion}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => navigate("/divisas")}
            >
              +
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary me-2">
          Registrar Movimiento
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/lista")}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default RegistrarGastos;
