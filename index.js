const express = require('express');
const bodyParser = require('body-parser');
const { readTalkers, searchTalkers } = require('./middlewares/middleManager');
const { 
  passwordVerification,
  emailVerification,
  loginVerification,
} = require('./middlewares/middleLogin');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', readTalkers);

app.get('/talker/:id', searchTalkers);

app.post('/login', passwordVerification, emailVerification, loginVerification);

app.listen(PORT, () => {
  console.log('Online');
});
