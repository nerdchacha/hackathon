
require('dotenv').config()
const app = require('./index')
const port = 3000

process.env.AUTH_SERVICE_URL = '';

app.listen(port)
console.info(`listening on http://localhost:${port}`)