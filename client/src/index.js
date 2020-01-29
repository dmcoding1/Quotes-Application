import './styles/reset.scss';
import './styles/main.scss';
import QuoteApp from "./js/App";

window.onload = function() {
  "use strict";

  const quoteNode = document.getElementById("quote");
  const loaderNode = document.getElementById("loader");
  const randomQuote = document.getElementById("random");
  const authorNode = document.getElementById("author");
  const searchContainer = document.querySelector(".search-results");
  const searchBtn = document.querySelector(".search__icon");
  const authorInput = document.querySelector(".search__input");
  const quotesList = document.querySelector(".search-results__list");
  const searchExitBtn = document.querySelector(".search-results__btn");

  const App = new QuoteApp({quoteNode, loaderNode, authorNode, searchContainer});
  App.showRandomQuote();

  randomQuote.addEventListener("click", () => App.showRandomQuote());

  searchBtn.addEventListener("click", () => App.getAuthorQuotes(authorInput, quotesList));

  window.addEventListener("keyup", (e) => {
    if (e.key === "Enter")
      App.getAuthorQuotes(authorInput, quotesList);
  });

  searchExitBtn.addEventListener("click", () => searchContainer.classList.remove("show"));
  
};