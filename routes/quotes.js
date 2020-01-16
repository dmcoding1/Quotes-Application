const Quote = require('../models/Quote');

module.exports = app => {
  app.get('/quotes', async (req, res, next) => {
    try {
      let { author, genre } = req.query;
      const quotes = await Quote.find({
        author: {"$regex": ".*" + (author ? author : "") + ".*"},
        genre: {"$regex": ".*" + (genre ? genre : "") + ".*"}
      });
      res.send(quotes);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  }),
  app.get('/quote/:id', async (req, res, next) => {
    try {
      const quote = await Quote.find({_id: req.params.id});
      res.send(quote);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  })
  app.get('/random', async (req, res, next) => {
    try {
      const quotesCount = await Quote.estimatedDocumentCount();
      const randomQuoteCount = Math.floor(Math.random() * (quotesCount - 1)) + 1;
      const quote = await Quote.find().skip(randomQuoteCount).limit(1);
      res.send(quote);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  })
};