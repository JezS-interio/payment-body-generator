// Datos embebidos directamente (Vercel tiene filesystem read-only)
// Los agregados en runtime se guardan en memoria (se resetean al reiniciar la función)

let paises = {
  "argentina": { "amount": "150000.00", "currency": "ARS", "billing_address": { "country": "AR", "state": "Cordoba", "city": "Cordoba", "address": "Av Arequipa 1234", "zip": "5000", "phone": "+5493482747561" } },
  "bolivia": { "amount": "350.00", "currency": "BOB", "billing_address": { "country": "BO", "state": "Santa Cruz", "city": "Santa Cruz de la Sierra", "address": "Av Banzer 1000", "zip": "0000", "phone": "+59176365568" } },
  "brasil": { "amount": "250.00", "currency": "BRL", "billing_address": { "country": "BR", "state": "Sao Paulo", "city": "Sao Paulo", "address": "Av Paulista 1000", "zip": "01310-100", "phone": "+5511987654321" } },
  "chile": { "amount": "45000.00", "currency": "CLP", "billing_address": { "country": "CL", "state": "Region Metropolitana", "city": "Santiago", "address": "Av Providencia 1000", "zip": "8320000", "phone": "+56993620113" } },
  "colombia": { "amount": "200000.00", "currency": "COP", "billing_address": { "country": "CO", "state": "Antioquia", "city": "Medellin", "address": "Av Providencia 1000", "zip": "050021", "phone": "+573008006290" } },
  "costa rica": { "amount": "25000.00", "currency": "CRC", "billing_address": { "country": "CR", "state": "San Jose", "city": "San Jose", "address": "Av Central 100", "zip": "10101", "phone": "+5783289903" } },
  "dominicana": { "amount": "3000.00", "currency": "DOP", "billing_address": { "country": "DO", "state": "Santo Domingo", "city": "Santo Domingo", "address": "Av Duarte 100", "zip": "10101", "phone": "+5783289903" } },
  "ecuador": { "amount": "60.00", "currency": "USD", "billing_address": { "country": "EC", "state": "Pichincha", "city": "Quito", "address": "Av Amazonas 1234", "zip": "170150", "phone": "+593986440132" } },
  "guatemala": { "amount": "100.00", "currency": "GTQ", "billing_address": { "country": "GT", "state": "Guatemala", "city": "Guatemala", "address": "Av Reforma", "zip": "01001", "phone": "+50212345678" } },
  "honduras": { "amount": "1250.00", "currency": "HNL", "billing_address": { "country": "HN", "state": "Cortes", "city": "San Pedro Sula", "address": "Av Circunvalacion", "zip": "21102", "phone": "+50487981917" } },
  "mexico": { "amount": "900.00", "currency": "MXN", "billing_address": { "country": "MX", "state": "Ciudad de Mexico", "city": "Ciudad de Mexico", "address": "Av Arequipa 1234", "zip": "06000", "phone": "+524424667608" } },
  "panama": { "amount": "50.00", "currency": "PAB", "billing_address": { "country": "PA", "state": "Panama", "city": "Ciudad de Panama", "address": "Av Balboa 100", "zip": "0801", "phone": "+50764350000" } },
  "paraguay": { "amount": "370000", "currency": "PYG", "billing_address": { "country": "PY", "state": "Central", "city": "Asuncion", "address": "Av Mariscal Lopez", "zip": "1000", "phone": "+57981994769" } },
  "peru": { "amount": "190.00", "currency": "PEN", "billing_address": { "country": "PE", "state": "Lima", "city": "Lima", "address": "Av Arequipa 1234", "zip": "15001", "phone": "+51908815030" } }
};

let methods = {
  "argentina": ["smt-bank-transfer", "bts-ars", "inf-ar-btr-offline", "inf-ar-btr-pull"],
  "bolivia": ["smt-wallet", "vpay"],
  "brasil": ["pix", "s-interio-cashier", "inf-br-qr-copy"],
  "chile": ["paycash-chile", "smt-wallet", "smt-credit-card", "smt-bank-transfer", "s-interio-cashier", "inf-cl-btr-offline"],
  "colombia": ["smt-nequi", "smt-transfiya", "smt-efecty", "smt-pse", "smt-bank-transfer", "paycash-colombia", "bts-cop"],
  "ecuador": ["smt-wallet", "smt-bank-transfer", "paycash-ecuador"],
  "mexico": ["smt-bank-transfer", "paycash-mexico", "bts-mxn", "inf-mx-btr-spei"],
  "peru": ["smt-cip", "smt-wallet", "smt-bank-transfer", "paycash-peru", "s-interio-cashier", "inf-pe-btr-offline", "inf-pe-btr-pull", "inf-pe-offline-service-payment"],
  "honduras": ["paycash-honduras"],
  "guatemala": ["paycash-guatemala"],
  "costa rica": ["paycash-costarica"],
  "panama": ["paycash-panama"],
  "dominicana": ["paycash-dominicana"],
  "credit_card": ["trans"]
};

let documentos = {
  "argentina": ["DNI: 25615611", "DNI: 25419660", "DNI: 21871500", "DNI: 23198421", "DNI: 37182213", "DNI: 32749137", "CUIT: 19371822132"],
  "brasil": ["CPF: 284.415.831-53", "CPF: 135.462.888-82", "CPF: 072.924.732-53", "CPF: 181.748.841-49"],
  "chile": ["CI: 93394216", "CI: 17404288-8", "CI: 63718556", "RUT: 7607291-4", "RUT: 134356618", "RUT: 70279657", "RUT: 251193738", "RUT: 171165903", "RUT: 151121578"],
  "colombia": ["CC: 7175737", "CC: 77039757", "CC: 80260961", "CC: 1000127418", "CC: 80220499", "CC: 93406279", "CC: 79729481", "CC: 1036641770", "CC: 19308526"],
  "ecuador": ["Cédula: 1308461589"],
  "guatemala": ["DPI: 1234567890101"],
  "honduras": ["Identidad: 0801199912345"],
  "mexico": ["CURP: Cemj910624hnlprn04", "CURP: CEMJ910624HNLPRN04", "CURP: Fual740728mnlnlr03", "CURP: AOCM961224HYNCCN03", "CURP: PEVJ850608HYNCCS16", "CURP: PIBB830416HQTXTR07", "CURP: AAAR820921HBSMGN04", "CURP: OIRM920619HVZRNN00", "CURP: AUCL010212HSPGNSA9", "CURP: GUTR870212HSPTRF00", "RFC: GODE561231GR8"],
  "panama": ["Cédula: 812345678"],
  "paraguay": ["Cédula: 1234567", "Cédula: 4832156"],
  "peru": ["DNI: 60526147", "DNI: 23804034", "DNI: 463234332", "DNI: 87654521", "DNI: 31348862", "DNI: 07007834", "DNI: 15620471", "DNI: 29419822"]
};

export { paises, methods, documentos };
