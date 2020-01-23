import './styles/main.scss';
import QuoteApp from "./js/App";

window.onload = function() {
  "use strict";

  const quoteNode = document.getElementById("quote");
  const loaderNode = document.getElementById("loader");
  const randomQuote = document.getElementById("random");

  const App = new QuoteApp({quoteNode, loaderNode});
  App.showRandomQuote();

  randomQuote.addEventListener("click", () => App.showRandomQuote());
  
};