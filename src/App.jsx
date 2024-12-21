// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Inicio } from './components/Inicio';
import { Menu } from './components/Menu';
import RegistrarGastos from './components/Gastos/RegistrarGastos';
import ListarGastos from './components/Gastos/ListarGastos';
import Categorias from './components/Categorias';
import MedioPago from './components/MetodoPago';
import TipoTransaccion from './components/TiposTransacciones';
import Divisa from './components/Divisas';
import EditarGasto from './components/Gastos/EditarGasto';
import Login from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';

function App() {
  return (
    <BrowserRouter>
      <div className="divBody">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Menu />
                <Routes>
                  <Route path="/inicio" element={<Inicio />} />
                  <Route path="/registro" element={<RegistrarGastos />} />
                  <Route path="/lista" element={<ListarGastos />} />
                  <Route path="/categorias" element={<Categorias />} />
                  <Route path="/medio-pago" element={<MedioPago />} />
                  <Route path="/tipo-transaccion" element={<TipoTransaccion />} />
                  <Route path="/divisas" element={<Divisa />} />
                  <Route path="/editar-gasto/:id" element={<EditarGasto />} />
                  <Route path="*" element={<Navigate to="/inicio" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
