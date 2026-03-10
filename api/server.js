const express = require('express');
const app = express();
const port = 3000;

app.get('/tickets', (req, res) => {
  res.send('Tickets endpoint');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
