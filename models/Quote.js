const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  quote: String,
  author: String,
  genre: String
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;