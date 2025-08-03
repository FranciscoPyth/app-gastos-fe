import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { obtenerGastos } from "../../services/gastos.services";
import { obtenerMediosPago } from "../../services/metodoPago.services";
import { obtenerTipoTransaccion } from "../../services/tipoTransaccion.services";
import { obtenerCategorias } from "../../services/categoria.services";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { parseJwt } from "../parseJWT.ts";
import { formatDate, formatMonto } from "../../helpers/format.ts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ReporteGastos = () => {
  const { register, handleSubmit, reset } = useForm();
  const [datos, setDatos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [tiposTransaccion, setTiposTransaccion] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState("");

  // Función para agrupar datos por mes
  const agruparPorMes = (data) => {
    const meses = {};
    data.forEach((gasto) => {
      const fecha = new Date(gasto.fecha);
      const mesKey = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
      const tipo = gasto.TiposTransaccione.descripcion;
      
      if (!meses[mesKey]) {
        meses[mesKey] = { ingresos: 0, egresos: 0, mes: fecha.toLocaleString('es-ES', { month: 'long' }) };
      }
      
      if (tipo === "Ingreso") {
        meses[mesKey].ingresos += parseFloat(gasto.monto);
      } else {
        meses[mesKey].egresos += parseFloat(gasto.monto);
      }
    });
    return Object.entries(meses)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([_, value]) => value);
  };

  // Función para agrupar por categoría
  const agruparPorCategoria = (data, tipoTransaccion) => {
    const categoriasTotales = {};
    data.filter(gasto => gasto.TiposTransaccione.descripcion === tipoTransaccion)
        .forEach((gasto) => {
          const categoriaId = gasto.categoria_id;
          const categoriaName = categorias.find(cat => cat.id === categoriaId)?.descripcion || "Sin Categoría";
          
          if (!categoriasTotales[categoriaName]) {
            categoriasTotales[categoriaName] = 0;
          }
          categoriasTotales[categoriaName] += parseFloat(gasto.monto);
        });
    return categoriasTotales;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gastos, metodos, tipos, cats] = await Promise.all([
          obtenerGastos(userId),
          obtenerMediosPago(userId),
          obtenerTipoTransaccion(userId),
          obtenerCategorias(userId),
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
        setCategorias(cats);
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
    const { descripcion, fechaInicio, fechaFin, metodoPago, tipoTransaccion } = filters;

    let filtered = datos.filter((item) => {
      const cumpleFiltros = (
        (!descripcion || item.descripcion.toLowerCase().includes(descripcion.toLowerCase())) &&
        (!fechaInicio || new Date(item.fecha) >= new Date(fechaInicio)) &&
        (!fechaFin || new Date(item.fecha) <= new Date(fechaFin)) &&
        (!metodoPago || item.metodopago_id === parseInt(metodoPago)) &&
        (!tipoTransaccion || item.tipostransaccion_id === parseInt(tipoTransaccion))
      );

      if (selectedCategoria) {
        return cumpleFiltros && item.categoria_id === parseInt(selectedCategoria);
      }

      return cumpleFiltros;
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

  // Datos para el gráfico de barras
  const barChartData = {
    labels: agruparPorMes(filteredData).map(item => item.mes),
    datasets: [
      {
        label: 'Egresos',
        data: agruparPorMes(filteredData).map(item => item.egresos),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      },
      {
        label: 'Ingresos',
        data: agruparPorMes(filteredData).map(item => item.ingresos),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };

  // Datos para los gráficos de torta
  const pieChartDataEgresos = {
    labels: Object.keys(agruparPorCategoria(filteredData, "Egreso")),
    datasets: [{
      data: Object.values(agruparPorCategoria(filteredData, "Egreso")),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    }]
  };

  const pieChartDataIngresos = {
    labels: Object.keys(agruparPorCategoria(filteredData, "Ingreso")),
    datasets: [{
      data: Object.values(agruparPorCategoria(filteredData, "Ingreso")),
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 99, 132, 0.5)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    }]
  };

  // Datos para el gráfico de línea
  const lineChartData = {
    labels: agruparPorMes(filteredData).map(item => item.mes),
    datasets: [
      {
        label: 'Egresos por Mes',
        data: agruparPorMes(filteredData).map(item => item.egresos),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Ingresos por Mes',
        data: agruparPorMes(filteredData).map(item => item.ingresos),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ingresos y Egresos por Mes'
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolución de Ingresos y Egresos por Mes'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$ ' + value.toLocaleString('es-AR');
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        align: 'center'
      }
    }
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
              <p className="card-text">
                {formatMonto(totals.egresoARS.toFixed(2))}
              </p>
            </div>
          </div>
          <div
            className="card text-white bg-success me-2 mb-3"
            style={{ flex: "1 1 calc(20% - 10px)", minWidth: "18rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">Total Ingreso (ARS)</h5>
              <p className="card-text">
                {formatMonto(totals.ingresoARS.toFixed(2))}
              </p>
            </div>
          </div>
          <div
            className="card text-white bg-danger me-2 mb-3"
            style={{ flex: "1 1 calc(20% - 10px)", minWidth: "18rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">Total USD</h5>
              <p className="card-text">
                {formatMonto(totals.totalUSD.toFixed(2))}
              </p>
            </div>
          </div>
          <div
            className="card text-white bg-warning me-2 mb-3"
            style={{ flex: "1 1 calc(20% - 10px)", minWidth: "18rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">Total USDT</h5>
              <p className="card-text">
                {formatMonto(totals.totalUSDT.toFixed(2))}
              </p>
            </div>
          </div>
          <div
            className="card text-white bg-info mb-3"
            style={{ flex: "1 1 calc(20% - 10px)", minWidth: "18rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">Total ARS</h5>
              <p className="card-text">
                {formatMonto(totals.totalARS.toFixed(2))}
              </p>
            </div>
          </div>
        </div>
        {/* Filtros */}
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-wrap gap-3 w-100 mb-4">
          <div>
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              {...register("descripcion")}
            />
          </div>
          <div>
            <label className="form-label">Fecha Inicio</label>
            <input
              type="date"
              className="form-control"
              {...register("fechaInicio")}
            />
          </div>
          <div>
            <label className="form-label">Fecha Fin</label>
            <input
              type="date"
              className="form-control"
              {...register("fechaFin")}
            />
          </div>
          <div>
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
          <div>
            <label className="form-label">Categoría</label>
            <select 
              className="form-select" 
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
            >
              <option value="">Todas</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex align-items-end">
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

      {/* Gráficos */}
      <div className="row mb-4">
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-body" style={{ height: '400px' }}>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body" style={{ height: '400px' }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body" style={{ height: '450px', position: 'relative' }}>
              <h5 className="card-title text-center mb-4">Distribución de Egresos por Categoría</h5>
              <div style={{ position: 'absolute', top: '60px', left: '0', right: '0', bottom: '20px' }}>
                <Pie data={pieChartDataEgresos} options={pieChartOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body" style={{ height: '450px', position: 'relative' }}>
              <h5 className="card-title text-center mb-4">Distribución de Ingresos por Categoría</h5>
              <div style={{ position: 'absolute', top: '60px', left: '0', right: '0', bottom: '20px' }}>
                <Pie data={pieChartDataIngresos} options={pieChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteGastos;
