import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createDonation } from "../../utils/db.ts";
import { useAuth } from "../../contexts/AuthContext";

type DatosPago = {
  nombre: string;
  numeroTarjeta: string;
  fechaExpiracion: string;
  cvv: string;
};

const Donacion: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");

  const [datosPago, setDatosPago] = useState<DatosPago>({
    nombre: "",
    numeroTarjeta: "",
    fechaExpiracion: "",
    cvv: "",
  });

  const [errorMonto, setErrorMonto] = useState<string>("");
  const [errorPago, setErrorPago] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const amounts: number[] = [10000, 20000, 50000];

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
    setErrorMonto("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]+$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
      setErrorMonto("");
    }
  };

  const handlePagoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosPago((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelar = () => {
    if (loading) return;
    setSelectedAmount(null);
    setCustomAmount("");
    setErrorMonto("");
    setDatosPago({ nombre: "", numeroTarjeta: "", fechaExpiracion: "", cvv: "" });
    setErrorPago("");
    setLoading(false);
    navigate("/visualizacion/MainPage");
  };

  // Algoritmo de Luhn
  const validarTarjetaLuhn = (numero: string): boolean => {
    const numeroReverso = numero.replace(/\D/g, "").split("").reverse();
    let suma = 0;
    for (let i = 0; i < numeroReverso.length; i++) {
      let n = parseInt(numeroReverso[i]);
      if (i % 2 === 1) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      suma += n;
    }
    return suma % 10 === 0;
  };

  const validarFechaExpiracion = (fecha: string): boolean => {
    const match = fecha.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const mes = parseInt(match[1], 10);
    const anio = parseInt(`20${match[2]}`, 10);
    if (mes < 1 || mes > 12) return false;

    const ahora = new Date();
    const fechaExp = new Date(anio, mes);
    return fechaExp > ahora;
  };

  const esCVVValido = (cvv: string): boolean => {
    return /^\d{3}$/.test(cvv);
  };

  const validarDatosPago = (): boolean => {
    const { nombre, numeroTarjeta, fechaExpiracion, cvv } = datosPago;
    if (!nombre.trim() || !numeroTarjeta.trim() || !fechaExpiracion.trim() || !cvv.trim()) {
      setErrorPago("Por favor completa todos los campos del formulario de pago.");
      return false;
    }

    if (numeroTarjeta.length !== 16 || !validarTarjetaLuhn(numeroTarjeta)) {
      setErrorPago("El número de tarjeta no es válido.");
      return false;
    }

    if (!validarFechaExpiracion(fechaExpiracion)) {
      setErrorPago("La fecha de expiración no es válida o está vencida.");
      return false;
    }

    if (!esCVVValido(cvv)) {
      setErrorPago("El CVV debe tener exactamente 3 dígitos.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    const amountToDonate = selectedAmount ?? Number(customAmount);

    if (!amountToDonate || amountToDonate <= 0) {
      setErrorMonto("Por favor ingresa un monto positivo.");
      return;
    }

    if (!validarDatosPago()) {
      return;
    }

    setLoading(true);
    setErrorMonto("");
    setErrorPago("");

    try {
      const email = user?.email;
      if (!email) {
        setErrorPago("No se encontró un correo válido. Inicia sesión.");
        return;
      }

      await createDonation({
        email,
        monto: amountToDonate,
        nombre: datosPago.nombre,
        tarjeta: datosPago.numeroTarjeta,
        fecha_tarjeta: datosPago.fechaExpiracion,
        cvv: datosPago.cvv,
      });

      navigate("/gracias",{
        state: {
          selectedAmount,
          customAmount
        }
      });

    } catch (error) {
      console.error("Error al guardar la donación:", error);
      setErrorPago("Hubo un error al registrar la donación. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };


  return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
        <h2 className="text-center text-2xl font-bold text-purple-700 mb-6">Realiza tu donación</h2>

        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
        >
          <div className="flex justify-between">
            {amounts.map((amt) => (
                <button
                    key={amt}
                    type="button"
                    disabled={loading}
                    className={`flex-1 mx-1 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                        selectedAmount === amt
                            ? "bg-purple-700 text-white"
                            : "bg-purple-200 text-purple-700 hover:bg-purple-400"
                    }`}
                    onClick={() => handleAmountClick(amt)}
                >
                  ${amt.toLocaleString()}
                </button>
            ))}
          </div>

          <input
              type="number"
              min={0}
              placeholder="Monto libre"
              value={customAmount}
              disabled={loading}
              onChange={handleCustomChange}
              className="border border-gray-300 rounded-lg p-2 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {errorMonto && <p className="text-red-600 text-sm">{errorMonto}</p>}

          <hr className="my-4 border-gray-300" />

          <div className="flex flex-col gap-3">
            <input
                type="text"
                name="nombre"
                placeholder="Nombre del titular"
                value={datosPago.nombre}
                onChange={handlePagoChange}
                disabled={loading}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
            />

            <div className="relative">
              <input
                  type="text"
                  name="numeroTarjeta"
                  placeholder="Número de tarjeta"
                  value={datosPago.numeroTarjeta}
                  onChange={handlePagoChange}
                  disabled={loading}
                  maxLength={16}
                  className="border border-gray-300 rounded-lg p-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
              />
              {datosPago.numeroTarjeta.length === 16 && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl">
                {validarTarjetaLuhn(datosPago.numeroTarjeta) ? "✅" : "❌"}
              </span>
              )}
            </div>

            <div className="flex gap-3">
              <input
                  type="text"
                  name="fechaExpiracion"
                  placeholder="MM/AA"
                  value={datosPago.fechaExpiracion}
                  onChange={handlePagoChange}
                  disabled={loading}
                  maxLength={5}
                  className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
              />
              <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={datosPago.cvv}
                  onChange={handlePagoChange}
                  disabled={loading}
                  maxLength={3}
                  className="border border-gray-300 rounded-lg p-2 w-20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
              />
            </div>

            {errorPago && <p className="text-red-600 text-sm">{errorPago}</p>}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
                type="button"
                onClick={handleCancelar}
                disabled={loading}
                className="bg-gray-300 text-black-700 px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
                type="submit"
                disabled={loading}
                className={`bg-purple-700 text-white font-bold px-6 py-2 rounded-lg hover:bg-purple-800 transition cursor-pointer ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Procesando..." : "Donar"}
            </button>
          </div>
        </form>
      </div>
  );
};

export default Donacion;
