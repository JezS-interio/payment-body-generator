# Payment Body Generator

Aplicación web para generar bodies de pago para Latam, gestionar países y métodos de pago, y consultar documentos de prueba por país.

Combina:

- Frontend en React + Material UI.
- API serverless en `/api` (estilo Vercel Functions).
- Login simple basado en cookie de sesión (`HttpOnly`).

## Objetivo

Centralizar en una única interfaz interna:

- Generación de payloads para operaciones de compra.
- Catálogo de países con monto, moneda y dirección de facturación.
- Métodos de pago por país.
- Documentos de prueba por país.

## Stack Tecnológico

- React 18
- Material UI 5
- Axios
- React Router 6
- Node.js (API serverless)
- `crypto` nativo de Node para hash de integridad

Dependencias y scripts: ver `package.json`.

## Estructura del Proyecto

```text
api/
  _data.js          # Datos embebidos: países, métodos, documentos
  _utils.js         # Validaciones de amount y phone
  login.js          # Login y creación de cookie de sesión
  logout.js         # Cierre de sesión
  me.js             # Estado de sesión actual
  paises.js         # GET/POST países
  methods.js        # GET/POST métodos por país
  documentos.js     # GET documentos por país
  generar-body.js   # Generación del body final + hash

src/
  App.js            # Router, layout principal y tabs
  index.js
  context/
    AuthContext.js  # Estado de autenticación
  components/
    PaymentBody.js  # Pantalla principal de generación
    Documents.js    # Consulta de documentos
    AddCountry.js   # Alta de país
    Countries.js    # Listado de países
    Methods.js      # Gestión de métodos
    Login.js        # Pantalla de acceso
    _shared.js      # Axios + estilos compartidos
```

## Variables de Entorno

El proyecto usa:

- `APP_USERNAME`
- `APP_PASSWORD`

```

Sin estas variables, `POST /api/login` responde error `500`.

## Flujo de Autenticación

1. Usuario envía credenciales a `POST /api/login`.
2. Si son válidas, backend setea cookie `session` (`HttpOnly`, `SameSite=Lax`, `Max-Age=86400`).
3. Frontend consulta `GET /api/me` para reconstruir sesión.
4. `POST /api/logout` limpia la cookie.

Notas:

- En producción, la cookie incluye `Secure`.
- `AuthContext` refresca estado de sesión cada 120 segundos.

## Endpoints API

### `POST /api/login`

Body:

```json
{
  "username": "...",
  "password": "..."
}
```

Respuestas:

- `200`: `{ "username": "..." }`
- `401`: credenciales inválidas
- `500`: variables de entorno faltantes

### `POST /api/logout`

Respuesta:

- `200`: `{ "ok": true }`

### `GET /api/me`

Respuesta:

- sesión válida: `{ "user": "<username>" }`
- sin sesión: `{ "user": null }`

### `GET /api/paises`

Devuelve objeto completo de países configurados.

### `POST /api/paises`

Body esperado:

```json
{
  "nombre": "mexico",
  "amount": "900.00",
  "currency": "MXN",
  "billing_address": {
    "country": "MX",
    "state": "Ciudad de Mexico",
    "city": "Ciudad de Mexico",
    "address": "Av X",
    "zip": "06000",
    "phone": "+521234567890"
  }
}
```

Validaciones:

- País no repetido.
- `amount` con formato decimal válido y mayor a `0`.
- `phone` obligatorio, con `+` y largo entre 8 y 15 dígitos (sin contar `+`).

### `GET /api/methods`

Devuelve métodos por país.

### `POST /api/methods`

Body:

```json
{
  "pais": "mexico",
  "method": "paycash-mexico"
}
```

Validaciones:

- Campos obligatorios.
- Evita duplicados por país.

### `GET /api/documentos`

Devuelve documentos de prueba por país.

### `POST /api/generar-body`

Genera el body de compra final.

Campos relevantes:

- `merchant_key`, `password`
- `order_number`, `order_description`
- `amount`, `currency`
- `method` (opcional)
- `cancel_url`, `success_url`, `error_url`
- `customer_name`, `customer_email`
- `billing_address` completo
- `recurring_init` (boolean)
- `req_token` (boolean)

Respuesta:

```json
{
  "body": {
    "merchant_key": "...",
    "operation": "purchase",
    "methods": ["..."],
    "order": {
      "number": "1",
      "amount": "500.00",
      "currency": "MXN",
      "description": "Purchase"
    },
    "cancel_url": "...",
    "success_url": "...",
    "error_url": "...",
    "customer": {
      "name": "...",
      "email": "..."
    },
    "billing_address": {
      "country": "MX",
      "state": "...",
      "city": "...",
      "address": "...",
      "zip": "...",
      "phone": "+..."
    },
    "recurring_init": true,
    "req_token": true,
    "hash": "..."
  }
}
```

Hash generado como:

1. Concatena en mayúsculas: `order_number + amount + currency + order_description + password`
2. `MD5`
3. `SHA1` del resultado MD5

## Interfaz Frontend

Luego de login, la app muestra 5 módulos (tabs):

1. `Body`: formulario principal y visualización/copia/descarga del JSON generado.
2. `Docs`: documentos de prueba por país (copiado rápido al portapapeles).
3. `Add Country`: alta de nuevos países.
4. `Countries`: visualización detallada de países y billing address.
5. `Methods`: alta y listado de métodos por país.

## Ejecución Local

### 1) Instalar dependencias

```bash
npm install
```

### 2) Configurar entorno

Crear `.env.local` (o `.env`) con:

```env
APP_USERNAME=tu_usuario
APP_PASSWORD=tu_password
```

### 3) Levantar frontend

```bash
npm start
```

Esto inicia React en `http://localhost:3000`.

### Nota sobre API en desarrollo

Actualmente el código usa dos patrones:

- Componentes con Axios (`_shared.js`): `http://localhost:4000/api` en desarrollo.
- Autenticación (`AuthContext.js`): rutas relativas `/api/...`.

Para que todo funcione en local de forma consistente, necesitás exponer la API también para las rutas relativas (por ejemplo, con proxy/reverse proxy o sirviendo frontend y API bajo el mismo host).

## Deploy

El proyecto está preparado para Vercel:

- API en `api/*.js`.
- `vercel.json` con rewrite a `index.html` para soporte SPA.

## Consideraciones Importantes

- Los datos en `api/_data.js` están embebidos en memoria.
- Los `POST` a `/api/paises` y `/api/methods` mutan estado en runtime, pero no persisten en base de datos.
- En funciones serverless, ese estado puede reiniciarse entre despliegues/restarts.
- No hay rate limiting ni roles de usuario (solo credenciales únicas por entorno).

