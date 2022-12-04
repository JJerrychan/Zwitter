const express = require("express");
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Page Not found' });
});

app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:4000');
});
