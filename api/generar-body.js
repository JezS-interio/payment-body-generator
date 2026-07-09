import crypto from 'crypto';
import { validarAmount, validarPhone, formatAmount } from './_utils.js';

function generarHash(order_number, order_amount, order_currency, order_description, password) {
  const str = (order_number + order_amount + order_currency + order_description + password).toUpperCase();
  const md5 = crypto.createHash("md5").update(str).digest("hex");
  return crypto.createHash("sha1").update(md5).digest("hex");
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const {
    merchant_key, password, order_number, order_description,
    amount, currency, method, cancel_url, success_url, error_url,
    customer_name, customer_email, billing_address, recurring_init, req_token
  } = req.body;

  let errores = [];
  if (!merchant_key?.trim()) errores.push("merchant_key es obligatorio");
  if (!password?.trim()) errores.push("password es obligatorio");
  if (!order_number?.trim()) errores.push("Order number es obligatorio");
  if (!order_description?.trim()) errores.push("Order description es obligatorio");
  const [okAmount, errAmount] = validarAmount(amount);
  if (!okAmount) errores.push(`Amount: ${errAmount}`);
  const [okPhone, errPhone] = validarPhone(billing_address?.phone || "");
  if (!okPhone) errores.push(`Phone: ${errPhone}`);
  if (!cancel_url?.trim() || !success_url?.trim() || !error_url?.trim())
    errores.push("Las URLs no pueden estar vacías");
  if (errores.length) return res.status(400).json({ errores });

  const amount_fmt = formatAmount(amount, currency);
  const hash = generarHash(order_number, amount_fmt, currency, order_description, password);

  const body = {
    merchant_key,
    operation: "purchase",
    ...(method ? { methods: [method] } : {}),
    order: { number: order_number, amount: amount_fmt, currency, description: order_description },
    cancel_url, success_url, error_url,
    customer: { name: customer_name, email: customer_email },
    billing_address: {
      country: billing_address.country.toUpperCase(),
      state: billing_address.state,
      city: billing_address.city,
      address: billing_address.address,
      zip: billing_address.zip,
      phone: billing_address.phone
    },
    recurring_init: !!recurring_init,
    req_token: !!req_token,
    hash
  };

  return res.json({ body });
}
