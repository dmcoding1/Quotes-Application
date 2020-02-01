const mongoose = require('mongoose');
const express = require('express');
const { MONGODB_URI, PORT } = require('./config.js')

const app = express();

app.use(express.json());

app.listen(PORT, () => {
  mongoose.connect(
    MONGODB_URI,
    { useNewUrlParser: true,
    useUnifiedTopology: true }
  );
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  require("./routes/quotes")(app);
  console.log(`Server started on port ${PORT}`);
});
