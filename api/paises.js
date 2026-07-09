import { paises } from './_data.js';
import { validarAmount, validarPhone, formatAmount } from './_utils.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.json(paises);
  }

  if (req.method === 'POST') {
    const { nombre, amount, currency, billing_address } = req.body;
    if (!nombre || !amount || !currency || !billing_address)
      return res.status(400).json({ error: "Faltan campos" });
    if (paises[nombre])
      return res.status(400).json({ error: "El país ya existe" });
    const [okAmount, errAmount] = validarAmount(amount);
    if (!okAmount) return res.status(400).json({ error: errAmount });
    const [okPhone, errPhone] = validarPhone(billing_address.phone);
    if (!okPhone) return res.status(400).json({ error: errPhone });
    paises[nombre] = {
      amount: formatAmount(amount, currency.trim().toUpperCase()),
      currency: currency.trim().toUpperCase(),
      billing_address: {
        country: billing_address.country.trim().toUpperCase(),
        state: billing_address.state.trim(),
        city: billing_address.city.trim(),
        address: billing_address.address.trim(),
        zip: billing_address.zip.trim(),
        phone: billing_address.phone.trim()
      }
    };
    return res.json({ success: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
