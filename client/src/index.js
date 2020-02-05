import "./styles/reset.scss";
import "./styles/loader.scss";
import "./styles/main.scss";
import QuoteApp from "./js/App";

window.onload = function() {
  "use strict";
  const pageLoader = document.getElementById("page-loader");
  pageLoader.classList.add("loaded");
  setTimeout(() => (pageLoader.style.display = "none"), 1000);

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
  const showAddFormBtn = document.querySelector(".search-results__add-btn");
  const addForm = document.querySelector(".add-quote");
  const addFormExitBtn = document.querySelector(".add-quote__btn-exit");
  const quoteAuthorInput = document.getElementById("quote-author");
  const quoteBodyInput = document.getElementById("quote-body");
  const addQuoteBtn = document.querySelector(".add-quote__btn");

  const App = new QuoteApp({
    quoteNode,
    quoteLoaderNode,
    authorNode,
    searchContainer,
    searchLoaderNode,
    showAddFormBtn
  });
  App.showRandomQuote();

  randomQuote.addEventListener("click", () => App.showRandomQuote());

  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    App.getAuthorQuotes(authorInput, quotesList);
  });

  searchExitBtn.addEventListener("click", () => {
    searchContainer.classList.remove("search-results--show");
    showAddFormBtn.classList.remove("search-results__add-btn--show");
  });

  addFormExitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    App.hideAddForm(addForm);
    quoteBodyInput.value = "";
    quoteAuthorInput.value = "";
  });

  showAddFormBtn.addEventListener("click", () => {
    searchContainer.classList.remove("search-results--show");
    App.showAddForm(addForm);
  });

  addForm.addEventListener("submit", e => {
    e.preventDefault();
    addQuoteBtn.classList.add("add-quote__btn--loading");
    const quote = {
      "quote": quoteBodyInput.value,
      "author": quoteAuthorInput.value,
      "genre": "age"
    };
    App.API.postQuote(quote);
    addQuoteBtn.classList.remove("add-quote__btn--loading");
    App.hideAddForm(addForm);
    quoteBodyInput.value = "";
    quoteAuthorInput.value = "";
  });

  quoteBodyInput.addEventListener("keypress", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const quote = {
        "quote": quoteBodyInput.value,
        "author": quoteAuthorInput.value,
        "genre": "age"
      };
      App.API.postQuote(quote);
      App.hideAddForm(addForm);
      quoteBodyInput.value = "";
      quoteAuthorInput.value = "";
    }    
  });

  quotesList.addEventListener("click", e => {
    if (e.target.tagName === "LI") {
      searchContainer.classList.remove("search-results--show");
      quoteNode.textContent = "";
      App.animateText(e.target.childNodes[0].wholeText);
      authorNode.textContent = e.target.childNodes[2].wholeText;
    }    
  });
};
