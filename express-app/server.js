const express = require('express');
const app = express();
app.use(express.json());

let reminders = [];

// Create
app.post('/reminders', (req, res) => {
  const reminder = req.body;
  reminders.push(reminder);
  res.status(201).send(reminder);
});

// Read
app.get('/reminders', (req, res) => {
  res.send(reminders);
});

// Update
app.put('/reminders/:id', (req, res) => {
  const id = req.params.id;
  reminders[id] = req.body;
  res.send(reminders[id]);
});

// Delete
app.delete('/reminders/:id', (req, res) => {
  const id = req.params.id;
  reminders.splice(id, 1);
  res.send({ message: 'Reminder deleted' });
});

app.listen(3000, () => console.log('Server running on port 3000'));