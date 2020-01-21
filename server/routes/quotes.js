const Quote = require('../models/Quote');
var cors = require('cors');

module.exports = app => {
  app.get('/quotes', cors(), async (req, res, next) => {
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
  app.get('/quote/:id', cors(), async (req, res, next) => {
    try {
      const quote = await Quote.find({_id: req.params.id});
      res.send(quote);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  }),
  app.get('/random', cors(), async (req, res, next) => {
    try {
      const quotesCount = await Quote.estimatedDocumentCount();
      const randomQuoteCount = Math.floor(Math.random() * (quotesCount - 1)) + 1;
      const quote = await Quote.findOne({}, null, {
        skip: randomQuoteCount,
        limit: 1
      });
      res.send(quote);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  }),
  app.get("*", cors(), async (req, res, next) => {
    res.status(404).send({
      message: "Not found"
    })
  })
};