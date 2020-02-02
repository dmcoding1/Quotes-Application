import './styles/reset.scss';
import './styles/main.scss';
import QuoteApp from "./js/App";

window.onload = function() {
  "use strict";

  const quoteNode = document.getElementById("quote");
  const quoteLoaderNode = document.querySelector(".quote__loader");
  const searchLoaderNode = document.querySelector(".search__loader");
  const randomQuote = document.getElementById("random");
  const authorNode = document.getElementById("author");
  const searchContainer = document.querySelector(".search-results");
  const searchForm = document.querySelector(".search__form");
  const authorInput = document.querySelector(".search__input");
  const quotesList = document.querySelector(".search-results__list");
  const searchExitBtn = document.querySelector(".search-results__btn");

  const App = new QuoteApp({quoteNode, quoteLoaderNode, authorNode, searchContainer, searchLoaderNode});
  App.showRandomQuote();

  randomQuote.addEventListener("click", () => App.showRandomQuote());

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    App.getAuthorQuotes(authorInput, quotesList);
  });

  searchExitBtn.addEventListener("click", () => searchContainer.classList.remove("search-results--show"));
  
};