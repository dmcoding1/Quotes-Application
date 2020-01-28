import './styles/reset.scss';
import './styles/main.scss';
import QuoteApp from "./js/App";

window.onload = function() {
  "use strict";

  const quoteNode = document.getElementById("quote");
  const loaderNode = document.getElementById("loader");
  const randomQuote = document.getElementById("random");
  const authorNode = document.getElementById("author");
  const typeCursor = document.querySelector(".typed-cursor");

  const App = new QuoteApp({quoteNode, loaderNode, authorNode, typeCursor});
  App.showRandomQuote();

  randomQuote.addEventListener("click", () => App.showRandomQuote());
  
};