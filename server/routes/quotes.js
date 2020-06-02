const Quote = require('../models/Quote');
const cors = require('cors');

module.exports = app => {
  app.use(cors());
  
  app.get('/quotes', cors(), async (req, res, next) => {
    try {
      let { author, quote } = req.query;
      const names = author ? author.split(" ") : "";
      console.log(author, quote, names);
      const generateRegex = names => {
        if (!names) return "";
        return names.map(name => name + ".*").join("");
      }

      if (quote) quote = quote.replace(/\s+/g, ' ');

      const quotes = await Quote.find({
        author: {"$regex": ".*" + generateRegex(names) + ".*", "$options": "i"},
        quote: {"$regex": ".*" + (quote ? quote : "") + ".*", "$options": "i"}
      });
      
      res.send(quotes);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
  }),

  app.post("/quotes/add", async (req, res, next) => {

    const { quote, author, genre } = req.body;

    const quoteObj = new Quote({
      quote,
      author,
      genre
    });

    try {          
      await quoteObj.save();
      res.sendStatus(201);
    } catch(err) {
      console.error(err);
    }
  });

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