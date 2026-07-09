export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }

  const cookie = req.headers.cookie || '';
  const match = cookie.match(/session=([^;]+)/);

  if (!match) return res.json({ user: null });

  try {
    const username = Buffer.from(match[1], 'base64').toString('utf-8');
    const validUser = process.env.APP_USERNAME;
    if (username !== validUser) return res.json({ user: null });
    return res.json({ user: username });
  } catch {
    return res.json({ user: null });
  }
}
