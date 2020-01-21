import './styles/main.scss';
import QuoteApp from "./js/App";

window.onload = function() {
  "use strict";

  const quoteNode = document.getElementById("quote");

  const App = new QuoteApp(quoteNode);
  App.showRandomQuote();
  
};