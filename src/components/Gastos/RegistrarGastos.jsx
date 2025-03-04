import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  registrarGasto,
  registrarGastoConAudio,
} from "../../services/gastos.services";
import { format, parse } from "date-fns";
import { useGastoForm } from "../../hooks/useGastoForm.ts";
import SelectInput from "./SelectInput.tsx";
import TextInput from "./TextInput.tsx";
import { FaMicrophone, FaStop } from "react-icons/fa";

const RegistrarGastos = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const {
    categorias,
    mediosDePago,
    divisas,
    tipoTransacciones,
    userId,
    loading,
  } = useGastoForm(setValue);

  const [isRecording, setIsRecording] = useState(false);
  const recognizerRef = useRef(null);

  if (loading) return <div>Cargando...</div>;

  const onSubmit = async (data) => {
    try {
      data.fecha = format(
        parse(data.fecha, "dd/MM/yyyy", new Date()),
        "yyyy-MM-dd"
      );
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

  const startRecording = async () => {
    try {
      const recognizer = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognizer.lang = "es-ES";
      recognizer.interimResults = false;
      recognizer.maxAlternatives = 1;

      recognizer.onresult = async (event) => {
        const textoTranscrito = event.results[0][0].transcript;
        console.log("Texto transcrito:", textoTranscrito);

        try {
          await registrarGastoConAudio(textoTranscrito, userId);
          navigate("/lista");
        } catch (error) {
          console.error("Error al registrar el gasto con texto transcrito:", error);
        }
      };

      recognizer.onerror = (event) => {
        console.error("Error en la transcripción:", event.error);
      };

      recognizerRef.current = recognizer; // Guardamos la referencia
      recognizer.start();
      setIsRecording(true);

    } catch (error) {
      console.error("Error al iniciar la grabación:", error);
    }
  };

  const stopRecording = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      setIsRecording(false);
      console.log("Grabación detenida manualmente.");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <SelectInput
          label="Tipo Transacción"
          id="tipostransaccion_id"
          options={tipoTransacciones}
          register={register}
          required
          onAddClick={() => navigate("/tipo-transaccion")}
        />
        <TextInput
          label="Monto"
          id="monto"
          type="text"
          placeholder="Ingrese el monto"
          register={register}
          validation={{
            required: "El monto es obligatorio.",
            validate: (value) =>
              parseFloat(value.replace(",", ".")) >= 0.01
                ? true
                : "El monto debe ser mayor a 0.",
          }}
          error={errors.monto?.message}
        />
        <TextInput
          label="Descripción"
          id="descripcion"
          type="text"
          register={register}
          required
        />
        <TextInput
          label="Fecha de la transacción"
          id="fecha"
          type="text"
          placeholder="DD/MM/YYYY"
          register={register}
          validation={{
            required: "La fecha es obligatoria.",
            pattern: {
              value: /^\d{2}\/\d{2}\/\d{4}$/,
              message: "El formato debe ser DD/MM/YYYY.",
            },
          }}
          error={errors.fecha?.message}
        />
        <SelectInput
          label="Categoría"
          id="categoria_id"
          options={categorias}
          register={register}
          required
          onAddClick={() => navigate("/categorias")}
        />
        <SelectInput
          label="Medio de Pago"
          id="metodopago_id"
          options={mediosDePago}
          register={register}
          required
          onAddClick={() => navigate("/medio-pago")}
        />
        <SelectInput
          label="Divisa"
          id="divisa_id"
          options={divisas}
          register={register}
          required
          onAddClick={() => navigate("/divisas")}
        />

        <button type="submit" className="btn btn-primary mt-3 me-2">
          Registrar Movimiento
        </button>
        <button
          type="button"
          className="btn btn-secondary mt-3"
          onClick={() => navigate("/lista")}
        >
          Cancelar
        </button>

        {/* 🎤 Botón de grabación de audio */}
        <div className="mt-3">
          <button
            type="button"
            className={`btn ${
              isRecording ? "btn-danger" : "btn-dark"
            } rounded-circle`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <FaStop size={16} /> : <FaMicrophone size={16} />}
          </button>
          <span className="ms-2">
            {isRecording ? "Registrando..." : "Registrar movimiento con audio"}
          </span>
        </div>
      </form>
    </div>
  );
};

export default RegistrarGastos;
