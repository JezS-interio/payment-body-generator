import { methods } from './_data.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.json(methods);
  }

  if (req.method === 'POST') {
    const { pais, method } = req.body;
    if (!pais || !method)
      return res.status(400).json({ error: "Faltan campos" });
    if (!methods[pais]) methods[pais] = [];
    if (methods[pais].includes(method))
      return res.status(400).json({ error: "Ese method ya existe para este país" });
    methods[pais].push(method);
    return res.json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { pais, method } = req.body;
    if (!pais || !method)
      return res.status(400).json({ error: "Faltan campos" });
    if (!methods[pais] || !methods[pais].includes(method))
      return res.status(400).json({ error: "Ese method no existe para este país" });
    methods[pais] = methods[pais].filter(m => m !== method);
    return res.json({ success: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
