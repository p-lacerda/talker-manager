const fs = require('fs').promises;

const regexDate = /^(0?[1-9]|[12][0-9]|3[01])[\\/](0?[1-9]|1[012])[\\/\\-]\d{4}$/;
const regToken = /^[a-zA-Z0-9]{16}$/;
const talker = './talker.json';

// GET
const readTalkers = async (req, res) => {
  const data = await fs.readFile(talker).then((response) => JSON.parse(response));

  if (data.length === 0) {
    return res.status(200).json([]);
  }

  res.status(200).json(data);
};

const searchTalkers = async (req, res) => {
  const data = await fs.readFile(talker).then((response) => JSON.parse(response));

  const { id } = req.params;

  const people = data.find((r) => r.id === Number(id));

  if (!people) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(people);
};

// POST

function tokenVerification(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' }); 
  } 
  if (regToken.test(String(authorization)) === false) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
}

function nameVerification(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' }); 
  } 
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
}

function ageVerification(req, res, next) {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' }); 
  } 
  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
}

function rateVerification(req, res, next) {
  if (req.body.talk) {
    const { rate } = req.body.talk;
    if (rate < 1 || rate > 5) {
      return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
    }
  }
  next();
}

function dateVerification(req, res, next) {
  const { talk } = req.body;

  if (talk) {
    const { watchedAt } = req.body.talk;
    if (regexDate.test(watchedAt) === false) {
      // console.log(regexDate.test(watchedAt));
      return res.status(400).json({
        message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
      }); 
    } 
  }
  next();
}

function talkVerification(req, res, next) {
  const { talk } = req.body;

  if (!talk || !talk.watchedAt || !talk.rate) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    }); 
  }

  next();
}

async function addUser(req, res) {
const { name, age, talk } = req.body;
  const talkFile = await fs.readFile(talker, 'utf-8')
    .then((response) => JSON.parse(response));
  const userInfo = { name, age, id: talkFile.length + 1 };
  const userTalk = { talk: { watchedAt: talk.watchedAt, rate: talk.rate } };
  const user = { ...userInfo, ...userTalk };
  await talkFile.push(user);
  await fs.writeFile(talker, JSON.stringify(talkFile))
  .then(() => {
   console.log('Arquivo escrito com sucesso!');
 });
 const newTalkFile = await fs.readFile(talker, 'utf-8')
 .then((response) => JSON.parse(response))
 .then((response) => response.find((person) => person.id === user.id));
  res.status(201).json(newTalkFile);
}

module.exports = { 
  readTalkers,
  searchTalkers,
  tokenVerification,
  nameVerification,
  ageVerification,
  rateVerification,
  dateVerification,
  talkVerification,
  addUser,
};