export function validarAmount(valor) {
  valor = valor.trim();
  if (!valor) return [false, "El amount no puede estar vacío"];
  if (valor.includes(",")) return [false, "Usá punto y no coma. Ejemplo: 500.00"];
  if (!/^\d+(\.\d{1,2})?$/.test(valor)) return [false, "Formato inválido. Ejemplo válido: 500 o 500.00"];
  const numero = parseFloat(valor);
  if (isNaN(numero)) return [false, "Número inválido"];
  if (numero <= 0) return [false, "El amount debe ser mayor a 0"];
  if (numero > 999999999999.99) return [false, "El amount es demasiado grande"];
  return [true, ""];
}

// Paraguay (PYG) es el único caso que opera sin decimales: tanto en el
// order.amount como en el string que se usa para calcular el hash.
export function formatAmount(amount, currency) {
  if (currency === "PYG") return String(Math.trunc(parseFloat(amount)));
  return parseFloat(amount).toFixed(2);
}

export function validarPhone(valor) {
  valor = valor.trim();
  if (!valor) return [false, "El teléfono no puede estar vacío"];
  if (!valor.startsWith("+")) return [false, "El teléfono debe empezar con +"];
  if (!/^\+\d+$/.test(valor)) return [false, "El teléfono solo puede tener + y números"];
  const digitos = valor.slice(1);
  if (digitos.length < 8) return [false, "El teléfono es demasiado corto"];
  if (digitos.length > 15) return [false, "El teléfono es demasiado largo"];
  return [true, ""];
}
