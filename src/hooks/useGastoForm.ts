import { useState, useEffect, useCallback } from "react";
import { obtenerCategorias } from "../services/categoria.services";
import { obtenerMediosPago } from "../services/metodoPago.services";
import { obtenerDivisa } from "../services/divisa.services";
import { obtenerTipoTransaccion } from "../services/tipoTransaccion.services";
import { parseJwt } from "../components/parseJWT.ts";
import { format } from "date-fns";

export const useGastoForm = (setValue: any) => {
  const [categorias, setCategorias] = useState([]);
  const [mediosDePago, setMediosDePago] = useState([]);
  const [divisas, setDivisas] = useState([]);
  const [tipoTransacciones, setTipoTransacciones] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtener usuario desde el token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      setUserId(decoded.id);
    }
  }, []);

  // Obtener datos solo cuando `userId` esté disponible
  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      const [categoriasData, mediosDePagoData, divisasData, tipoTransaccionesData] = await Promise.all([
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
      setValue("tipostransaccion_id", tipoTransaccionesData.find((t) => t.descripcion === "Egreso")?.id || "");
      setValue("categoria_id", categoriasData.find((c) => c.descripcion === "Salidas")?.id || "");
      setValue("metodopago_id", mediosDePagoData.find((m) => m.descripcion === "Efectivo")?.id || "");
      setValue("divisa_id", divisasData.find((d) => d.descripcion === "ARS")?.id || "");
      setValue("fecha", format(new Date(), "dd/MM/yyyy"));

      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setLoading(false);
    }
  }, [userId, setValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { categorias, mediosDePago, divisas, tipoTransacciones, userId, loading };
};
