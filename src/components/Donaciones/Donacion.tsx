import React, { useState, ChangeEvent, FormEvent } from "react";

type DatosPago = {
  nombre: string;
  numeroTarjeta: string;
  fechaExpiracion: string;
  cvv: string;
};

const Donacion: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [errorMonto, setErrorMonto] = useState<string>("");

  const [datosPago, setDatosPago] = useState<DatosPago>({
    nombre: "",
    numeroTarjeta: "",
    fechaExpiracion: "",
    cvv: "",
  });
  const [errorPago, setErrorPago] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const amounts: number[] = [10000, 20000, 50000];

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
    setErrorMonto("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    // Permitir número vacío o solo dígitos
    if (value === "" || /^[0-9]+$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null); // Deselecciona botones predefinidos si escribe algo
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
    setSuccess(false);
  };

  const validarDatosPago = (): boolean => {
    const { nombre, numeroTarjeta, fechaExpiracion, cvv } = datosPago;
    if (!nombre.trim() || !numeroTarjeta.trim() || !fechaExpiracion.trim() || !cvv.trim()) {
      setErrorPago("Por favor completa todos los campos del formulario de pago.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    const amountToDonate = selectedAmount ?? Number(customAmount);

    if (!amountToDonate || amountToDonate <= 0) {
      setErrorMonto("Por favor ingresa un monto positivo.");
      return;
    }
    setErrorMonto("");

    if (!validarDatosPago()) {
      return;
    }

    setLoading(true);
    setErrorPago("");
    setErrorMonto("");

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-8 mt-10 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">¡Gracias por tu donación!</h2>
        <p className="text-lg mb-2">
          Hemos recibido tu donación de{" "}
          <span className="font-semibold text-purple-800">
            ${ (selectedAmount ?? Number(customAmount)).toLocaleString() }
          </span>.
        </p>
        <p className="mb-6">Se ha enviado un recibo a tu correo electrónico.</p>
        <button
          onClick={handleCancelar}
          className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition"
        >
          Realizar otra donación
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-center text-2xl font-bold text-purple-700 mb-6">
        Realiza tu donación
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
          <input
            type="text"
            name="numeroTarjeta"
            placeholder="Número de tarjeta"
            value={datosPago.numeroTarjeta}
            onChange={handlePagoChange}
            disabled={loading}
            maxLength={16}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
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
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition cursor-pointer"
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