const express = require('express')
const mockService = require('./core/mock');

const app = express();

mockService.setupExpressMocks(app);
app.use(express.static('dist'));
app.use('/public', express.static('dist'));

app.listen(8001, () => console.log('Listening on port 8001!'))