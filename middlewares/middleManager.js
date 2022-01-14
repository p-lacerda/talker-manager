const fs = require('fs').promises;

const readTalkers = async (req, res) => {
  const data = await fs.readFile('./talker.json').then((response) => JSON.parse(response));

  if (data.length === 0) {
    return res.status(200).json([]);
  }

  return res.status(200).json(data);
};

const searchTalkers = async (req, res) => {
  const data = await fs.readFile('./talker.json').then((response) => JSON.parse(response));

  const { id } = req.params;

  const people = data.find((r) => r.id === Number(id));

  if (!people) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(people);
};

module.exports = { readTalkers, searchTalkers };