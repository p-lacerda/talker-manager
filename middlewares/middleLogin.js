// const fs = require('fs').promises;
// const generateToken = require('../helpers/generateToken');

const emailValidation = /\S+@\S+.\S+/;

function emailVerification(req, res, next) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' }); 
  } 
  if (emailValidation.test(email) === false) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
}

function passwordVerification(req, res, next) {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' }); 
  } 
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
}
  next();
}

function loginVerification(req, res) {
  res.status(200).json({ token:
    '7mqaVRXJSp886CGr',
  });
}

module.exports = { loginVerification, emailVerification, passwordVerification };