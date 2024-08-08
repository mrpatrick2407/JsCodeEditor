const executeScript = require('./executor.js');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/eval', async (req, res) => {
  const { code, call } = req.body;
  try {
    const { result, time, memory,console } = await executeScript(code, call);
    res.send({ result, time, memory,console });
  } catch (e) {
    console.error(e);
    res.status(500).send({ result: 'Something went wrong' });
  }
});

app.listen(3000, () => {
  console.log('Started server on port 3000');
});
