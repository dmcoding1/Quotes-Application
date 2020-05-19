import "./styles/reset.scss";
import "./styles/loader.scss";
import "./styles/main.scss";
import "./styles/animations.scss";
import "./styles/viewports.scss";
import QuoteApp from "./js/App";
import * as DOM from "./js/DOM";
import handleAutocomplete from "./js/autocomplete";

window.onload = function () {
  "use strict";
  const pageLoader = document.getElementById("page-loader");
  pageLoader.classList.add("loaded");
  setTimeout(() => (pageLoader.style.display = "none"), 1000);

  const {
    quoteNode,
    quoteLoaderNode,
    searchLoaderNode,
    randomQuote,
    authorNode,
  } = DOM.randomQuote;

  const {
    showAddFormBtn,
    addForm,
    addFormExitBtn,
    addFormLoader,
    quoteAuthorInput,
    quoteBodyInput,
    addQuoteBtn,
  } = DOM.addQuote;

  const {
    searchContainer,
    searchForm,
    authorInput,
    searchBtn,
    quotesList,
    searchExitBtn,
    autocompleteList,
  } = DOM.searchQuote;


  const App = new QuoteApp({
    quoteNode,
    quoteLoaderNode,
    authorNode,
    searchContainer,
    searchLoaderNode,
    showAddFormBtn,
  });

  App.showRandomQuote();

  randomQuote.addEventListener("click", () => App.showRandomQuote());

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  searchBtn.addEventListener("click", (e) => {
    App.hideElement(addForm, "add-quote--show");
    App.getAuthorQuotes(authorInput, quotesList);
    autocompleteList.innerHTML = "";
  });

  authorInput.addEventListener("input", (e) => {
    handleAutocomplete(e, App);
  });

  searchExitBtn.addEventListener("click", () => {
    App.hideElement(searchContainer, "search-results--show");
    App.hideElement(showAddFormBtn, "search-results__add-btn--show");
  });

  addFormExitBtn.addEventListener("click", (e) => {
    App.hideElement(addForm, "add-quote--show");
  });

  showAddFormBtn.addEventListener("click", () => {
    addFormLoader.textContent = "";
    quoteBodyInput.value = "";
    quoteAuthorInput.value = authorInput.value;
    App.hideElement(searchContainer, "search-results--show");
    App.showElement(addForm, "add-quote--show");
    App.animateElement(addForm, "add-quote--animate");
  });

  addForm.addEventListener("submit", (e) => {
    postQuote(e);
  });

  quoteBodyInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      postQuote(e);
    }
  });

  quoteAuthorInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      postQuote(e);
    }
  });

  addForm.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.key === "Escape") {
      App.hideElement(addForm, "add-quote--show");
      quoteBodyInput.value = "";
      quoteAuthorInput.value = "";
    }
  });

  quotesList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      quoteNode.textContent = "";
      App.hideElement(searchContainer, "search-results--show");
      App.animateText(e.target.childNodes[0].wholeText);
      authorNode.textContent = e.target.childNodes[2].wholeText;
    }
  });

  quotesList.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && e.target.tagName === "LI") {
      quoteNode.textContent = "";
      App.hideElement(searchContainer, "search-results--show");
      App.animateText(e.target.childNodes[0].wholeText);
      authorNode.textContent = e.target.childNodes[2].wholeText;
    }
  });

  document.addEventListener("click", (e) => {
    let target = e.target;

    do {
      if (target.classList && target.classList.contains("search-results")) {
        return;
      } else if (
        target.classList &&
        target.classList.contains("search__form")
      ) {
        return;
      } else if (target.classList && target.classList.contains("add-quote")) {
        return;
      }

      target = target.parentNode;
    } while (target);

    App.hideElement(searchContainer, "search-results--show");
    App.hideElement(addForm, "add-quote--show");
    autocompleteList.innerHTML = "";
  });

  function postQuote(e) {
    e.preventDefault();

    addFormLoader.textContent = "";
    App.hideElement(addFormLoader, "add-quote__loader--message");

    App.showElement(addQuoteBtn, "add-quote__btn--loading");

    const quote = {
      quote: quoteBodyInput.value,
      author: quoteAuthorInput.value,
      genre: "",
    };

    if (quote.author.length < 3 || quote.quote.length < 3) {
      App.showElement(addFormLoader, "add-quote__loader--message");
      addFormLoader.textContent =
        "Author and quote must have at least 3 characters";
      return;
    } else if (quote.quote.length > 400) {
      App.showElement(addFormLoader, "add-quote__loader--message");
      addFormLoader.textContent = "The quote is too long";
      return;
    }

    App.API.getQuote(quote.quote).then((res) => {
      if (res.length) {
        App.showElement(addFormLoader, "add-quote__loader--message");
        addFormLoader.textContent = `We already have this quote. Check ${res[0].author}`;
      } else {
        App.API.postQuote(quote);
        App.showElement(addFormLoader, "add-quote__loader--message");
        addFormLoader.textContent = "Quote added";
        quoteBodyInput.value = "";
        quoteAuthorInput.value = "";
      }
    });
  }

  
    
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}