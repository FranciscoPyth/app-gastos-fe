import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { obtenerGastos } from "../../services/gastos.services";
import { obtenerMediosPago } from "../../services/metodoPago.services";
import { obtenerTipoTransaccion } from "../../services/tipoTransaccion.services";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatDate = (date) => {
    const parsedDate = new Date(date);
    const day = String(parsedDate.getUTCDate()).padStart(2, '0'); // Día con dos dígitos
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0'); // Mes con dos dígitos (0-11, por lo que sumamos 1)
    const year = parsedDate.getUTCFullYear(); // Año
    return `${day}/${month}/${year}`;
  };

const ReporteGastos = () => {
  const { register, handleSubmit, reset } = useForm();
  const [datos, setDatos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [tiposTransaccion, setTiposTransaccion] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuario_id = 2; // Cambiar si necesitas pasar usuario_id

        // Obtener datos principales y relacionados
        const [gastos, metodos, tipos] = await Promise.all([
          obtenerGastos(usuario_id),
          obtenerMediosPago(usuario_id),
          obtenerTipoTransaccion(usuario_id),
        ]);

        // Mapear las relaciones en los datos
        const gastosConDescripcion = gastos.map((gasto) => ({
          ...gasto,
          metodoPagoDescripcion:
            metodos.find((metodo) => metodo.id === gasto.metodopago_id)?.descripcion || "N/A",
          tipoTransaccionDescripcion:
            tipos.find((tipo) => tipo.id === gasto.tipostransaccion_id)?.descripcion || "N/A",
        }));

        setDatos(gastosConDescripcion);
        setFilteredData(gastosConDescripcion); // Mostrar todo inicialmente

        setMetodosPago(metodos); // Guardar métodos de pago
        setTiposTransaccion(tipos); // Guardar tipos de transacción
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);

  const onSubmit = (filters) => {
    const { descripcion, fechaInicio, fechaFin, metodoPago, tipoTransaccion } = filters;

    const filtered = datos.filter((item) => {
      return (
        (!descripcion || item.descripcion.toLowerCase().includes(descripcion.toLowerCase())) &&
        (!fechaInicio || new Date(item.fecha) >= new Date(fechaInicio)) &&
        (!fechaFin || new Date(item.fecha) <= new Date(fechaFin)) &&
        (!metodoPago || item.metodoPagoId === parseInt(metodoPago)) &&
        (!tipoTransaccion || item.tipoTransaccionId === parseInt(tipoTransaccion))
      );
    });
    setFilteredData(filtered);
  };

  // Datos del gráfico
  const chartData = {
    labels: filteredData.map((d) => d.descripcion),
    datasets: [
      {
        label: "Montos",
        data: filteredData.map((d) => d.monto),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="row">
          <div className="col-md-3">
            <label className="form-label">Descripción</label>
            <input type="text" className="form-control" {...register("descripcion")} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Fecha Inicio</label>
            <input type="date" className="form-control" {...register("fechaInicio")} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Fecha Fin</label>
            <input type="date" className="form-control" {...register("fechaFin")} />
          </div>
          <div className="col-md-3">
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
          <div className="col-md-3">
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
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-primary me-2">
            Filtrar
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => reset()}>
            Limpiar
          </button>
        </div>
      </form>

      <div className="mb-4">
        <Bar data={chartData} />
      </div>

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
  );
};

export default ReporteGastos;
