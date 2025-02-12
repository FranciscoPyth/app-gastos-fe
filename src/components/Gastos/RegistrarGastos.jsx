import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registrarGasto } from "../../services/gastos.services";
import { format, parse } from "date-fns";
import { useGastoForm } from "../../hooks/useGastoForm.ts";
import SelectInput from "./SelectInput.tsx";
import TextInput from "./TextInput.tsx";
import { transcribeAudio, processExpenseText } from "../../services/transcriptionService.ts";
import { FaMicrophone, FaStop } from "react-icons/fa";

const RegistrarGastos = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { categorias, mediosDePago, divisas, tipoTransacciones, userId, loading } = useGastoForm(setValue);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  if (loading) return <div>Cargando...</div>;

  const onSubmit = async (data) => {
    try {
      data.fecha = format(parse(data.fecha, "dd/MM/yyyy", new Date()), "yyyy-MM-dd");
      if (userId) {
        data.usuario_id = userId;
        await registrarGasto(data);
        navigate("/lista");
      } else {
        console.error("No se ha encontrado el ID del usuario.");
      }
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
    }
  };

  // Funciones para manejar la grabación
  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  const onStop = async (recordedBlob) => {
    console.log("Audio grabado:", recordedBlob);
    setAudioBlob(recordedBlob.blob);
  
    const texto = await transcribeAudio(recordedBlob.blob);
    if (texto) {
      console.log("Texto transcrito:", texto);
  
      const datosGasto = await processExpenseText(texto);
      if (datosGasto) {
        setValue("monto", datosGasto.monto);
        setValue("descripcion", datosGasto.descripcion);
        setValue("fecha", datosGasto.fecha);
        console.log("Datos extraídos:", datosGasto);
      }
    }
  };
  

  return (
    <div className="container mt-5 mb-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <SelectInput label="Tipo Transacción" id="tipostransaccion_id" options={tipoTransacciones} register={register} required onAddClick={() => navigate("/tipo-transaccion")} />
        <TextInput label="Monto" id="monto" type="number" placeholder="Ingrese el monto" register={register} validation={{ required: "El monto es obligatorio.", min: { value: 0.01, message: "El monto debe ser mayor a 0." } }} error={errors.monto?.message} />
        <TextInput label="Descripción" id="descripcion" type="text" register={register} required />
        <TextInput label="Fecha de la transacción" id="fecha" type="text" placeholder="DD/MM/YYYY" register={register} validation={{ required: "La fecha es obligatoria.", pattern: { value: /^\d{2}\/\d{2}\/\d{4}$/, message: "El formato debe ser DD/MM/YYYY." } }} error={errors.fecha?.message} />
        <SelectInput label="Categoría" id="categoria_id" options={categorias} register={register} required onAddClick={() => navigate("/categorias")} />
        <SelectInput label="Medio de Pago" id="metodopago_id" options={mediosDePago} register={register} required onAddClick={() => navigate("/medio-pago")} />
        <SelectInput label="Divisa" id="divisa_id" options={divisas} register={register} required onAddClick={() => navigate("/divisas")} />

        {/* Botón de grabación mejorado */}
        <div className="mt-3 text-center">
          <button 
            type="button" 
            className={`btn ${isRecording ? "btn-danger" : "btn-dark"} rounded-circle p-3`} 
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <FaStop size={20} /> : <FaMicrophone size={20} />}
          </button>
        </div>

        <button type="submit" className="btn btn-primary mt-3 me-2">Registrar Movimiento</button>
        <button type="button" className="btn btn-secondary mt-3" onClick={() => navigate("/lista")}>Cancelar</button>
      </form>
    </div>
  );
};

export default RegistrarGastos;
