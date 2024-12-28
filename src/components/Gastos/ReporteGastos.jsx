import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { obtenerGastos } from "../../services/gastos.services";
import { obtenerMediosPago } from "../../services/metodoPago.services";
import { obtenerTipoTransaccion } from "../../services/tipoTransaccion.services";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { parseJwt } from "../parseJWT.ts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const formatDate = (date) => {
  const parsedDate = new Date(date);
  const day = String(parsedDate.getUTCDate()).padStart(2, "0");
  const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
  const year = parsedDate.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const ReporteGastos = () => {
  const { register, handleSubmit, reset } = useForm();
  const [datos, setDatos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [tiposTransaccion, setTiposTransaccion] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gastos, metodos, tipos] = await Promise.all([
          obtenerGastos(userId),
          obtenerMediosPago(userId),
          obtenerTipoTransaccion(userId),
        ]);

        const gastosConDescripcion = gastos.map((gasto) => ({
          ...gasto,
          metodoPagoDescripcion:
            metodos.find((metodo) => metodo.id === gasto.metodopago_id)
              ?.descripcion || "N/A",
          tipoTransaccionDescripcion:
            tipos.find((tipo) => tipo.id === gasto.tipostransaccion_id)
              ?.descripcion || "N/A",
        }));

        setDatos(gastosConDescripcion);
        setFilteredData(gastosConDescripcion);

        setMetodosPago(metodos);
        setTiposTransaccion(tipos);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      setUserId(decoded.id);
    }
  }, []);

  const onSubmit = (filters) => {
    const { descripcion, fechaInicio, fechaFin, metodoPago, tipoTransaccion } =
      filters;

    const filtered = datos.filter((item) => {
      return (
        (!descripcion ||
          item.descripcion.toLowerCase().includes(descripcion.toLowerCase())) &&
        (!fechaInicio || new Date(item.fecha) >= new Date(fechaInicio)) &&
        (!fechaFin || new Date(item.fecha) <= new Date(fechaFin)) &&
        (!metodoPago || item.metodopago_id === parseInt(metodoPago)) &&
        (!tipoTransaccion ||
          item.tipostransaccion_id === parseInt(tipoTransaccion))
      );
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    reset();
    setFilteredData(datos);
  };

  const totals = {
    egresoARS: datos
      .filter(
        (item) =>
          item.TiposTransaccione.descripcion === "Egreso" &&
          item.Divisa.descripcion === "ARS"
      )
      .reduce((sum, item) => sum + parseFloat(item.monto), 0),
    ingresoARS: datos
      .filter(
        (item) =>
          item.TiposTransaccione.descripcion === "Ingreso" &&
          item.Divisa.descripcion === "ARS"
      )
      .reduce((sum, item) => sum + parseFloat(item.monto), 0),
    totalUSD: datos
      .filter((item) => item.Divisa.descripcion === "USD")
      .reduce(
        (sum, item) =>
          item.TiposTransaccione.descripcion === "Ingreso"
            ? sum + parseFloat(item.monto)
            : sum - parseFloat(item.monto),
        0
      ),
    totalUSDT: datos
      .filter((item) => item.Divisa.descripcion === "USDT")
      .reduce(
        (sum, item) =>
          item.TiposTransaccione.descripcion === "Ingreso"
            ? sum + parseFloat(item.monto)
            : sum - parseFloat(item.monto),
        0
      ),
    totalARS: datos
      .filter((item) => item.Divisa.descripcion === "ARS")
      .reduce(
        (sum, item) =>
          item.TiposTransaccione.descripcion === "Ingreso"
            ? sum + parseFloat(item.monto)
            : sum - parseFloat(item.monto),
        0
      ),
  };

  // Datos del gráfico (Egreso vs Tiempo)
  const chartData = {
    labels: filteredData.map((d) => formatDate(d.fecha)),
    datasets: [
      {
        label: "Montos",
        data: filteredData.map((d) => d.monto),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="container mt-4">
      {/* Contenedor para tarjetas de resumen y filtros */}
      <div className="d-flex flex-wrap align-items-start mb-4">
        {/* Contenedor para tarjetas de resumen */}
        <div className="d-flex justify-content-between flex-wrap mb-4">
          <div
            className="card text-white bg-primary me-2 mb-3"
            style={{ flex: "1 1 calc(20% - 10px)", minWidth: "18rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">Total Egreso (ARS)</h5>
              <p className="card-text">${totals.egresoARS.toFixed(2)}</p>
            </div>
          </div>
          <div
            className="card text-white bg-success me-2 mb-3"
            style={{ flex: "1 1 calc(20% - 10px)", minWidth: "18rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">Total Ingreso (ARS)</h5>
              <p className="card-text">${totals.ingresoARS.toFixed(2)}</p>
            </div>
          </div>
          <div
            className="card text-white bg-danger me-2 mb-3"
            style={{ flex: "1 1 calc(20% - 10px)", minWidth: "18rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">Total USD</h5>
              <p className="card-text">${totals.totalUSD.toFixed(2)}</p>
            </div>
          </div>
          <div
            className="card text-white bg-warning me-2 mb-3"
            style={{ flex: "1 1 calc(20% - 10px)", minWidth: "18rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">Total USDT</h5>
              <p className="card-text">${totals.totalUSDT.toFixed(2)}</p>
            </div>
          </div>
          <div
            className="card text-white bg-info mb-3"
            style={{ flex: "1 1 calc(20% - 10px)", minWidth: "18rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">Total ARS</h5>
              <p className="card-text">${totals.totalARS.toFixed(2)}</p>
            </div>
          </div>
        </div>
        {/* Filtros */}
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-wrap">
          <div className="me-3 mb-3">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              {...register("descripcion")}
            />
          </div>
          <div className="me-3 mb-3">
            <label className="form-label">Fecha Inicio</label>
            <input
              type="date"
              className="form-control"
              {...register("fechaInicio")}
            />
          </div>
          <div className="me-3 mb-3">
            <label className="form-label">Fecha Fin</label>
            <input
              type="date"
              className="form-control"
              {...register("fechaFin")}
            />
          </div>
          <div className="me-3 mb-3">
            <label className="form-label">Método de Pago</label>
            <select className="form-select" {...register("metodoPago")}>
              <option value="">Todos</option>
              {metodosPago.map((medio) => (
                <option key={medio.id} value={medio.id}>
                  {medio.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className="me-3 mb-3">
            <label className="form-label">Tipo de Transacción</label>
            <select className="form-select" {...register("tipoTransaccion")}>
              <option value="">Todos</option>
              {tiposTransaccion.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.descripcion}
                </option>
              ))}
            </select>
          </div>

          {/* Contenedor para los botones */}
          <div className="w-100 mt-3">
            <button type="submit" className="btn btn-primary me-2">
              Filtrar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {/* Gráfico de barras */}
      <div className="mb-4">
        <Bar data={chartData} />
      </div>

      {/* Tabla */}
      <div className="table-responsive custom-table-container">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Método de Pago</th>
              <th>Tipo de Transacción</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td>{row.descripcion}</td>
                <td>{row.monto}</td>
                <td>{formatDate(row.fecha)}</td>
                <td>{row.metodoPagoDescripcion}</td>
                <td>{row.tipoTransaccionDescripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReporteGastos;
