const fs = require('fs').promises;

module.exports = async (req, res) => {
  const data = await fs.readFile('./talker.json').then((response) => JSON.parse(response));

  if (data.length === 0) {
    return res.status(200).json([]);
  }

  res.status(200).json(data);
};