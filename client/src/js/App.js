const Typed = require("typed.js");

import { searchQuote } from "./DOM";

const URL = process.env.HOST_URL;

class App {
  constructor(options = {}) {
    if (!options.quoteNode) {
      throw new Error("HTML element not provided");
    }

    this.quoteNode = options.quoteNode;
    this.loaderNode = options.quoteLoaderNode;
    this.authorNode = options.authorNode;
    this.searchContainer = options.searchContainer;
    this.searchLoader = options.searchLoaderNode;
    this.showAddFormBtn = options.showAddFormBtn;
    this.autocompleteList = searchQuote.autocompleteList;
    this.lastSearchInput = false;
    this.isTyping = false;

    this.API = {
      getRandomQuote: () => fetch(`${URL}/random`).then((res) => res.json()),
      getAuthorQuotes: (author, options = {}) =>
        fetch(`${URL}/quotes?author=${author}`, options).then((res) =>
          res.json()
        ),
      getQuote: (quote) =>
        fetch(`${URL}/quotes?quote=${quote}`).then((res) => res.json()),
      postQuote: (quoteObj) => {
        fetch(`${URL}/quotes/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quoteObj),
        })
          .then((res) => res.text())
          .catch((err) => console.error(err));
      },
    };
  }

  showRandomQuote() {
    if (this.isTyping) return;

    this.isTyping = true;
    this.quoteNode.textContent = "";
    this.authorNode.textContent = "";
    this.showElement(this.loaderNode, "quote__loader--show");

    this.API.getRandomQuote()
      .then((response) => {
        this.hideElement(this.loaderNode, "quote__loader--show");
        this.animateText(response.quote);
        this.authorNode.textContent = `~ ${response.author}`;
      })
      .catch((err) => {
        this.hideElement(this.loaderNode, "quote__loader--show");
        this.quoteNode.textContent =
          "Cannot connect to the server. Check your internet connection and try again.";
        console.error(err);
        this.isTyping = false;
      });
  }

  animateText(text = "") {
    const randomMistakesCount = Math.floor(Math.random() * (4 - 3) + 3);
    const splittedText = text.split("");
    const textLength = splittedText.length;
    const textToAnimate = [];
    let prevText = "";

    for (let i = 0; i < randomMistakesCount; i++) {
      const range = textLength / randomMistakesCount;
      prevText += splittedText.slice(i * range, i * range + range).join("");
      textToAnimate.push(
        i === randomMistakesCount - 1 || i === 0
          ? prevText
          : this.swapWords(prevText)
      );
    }

    new Typed(`#${this.quoteNode.id}`, {
      strings: text.length > 70 ? [text] : textToAnimate,
      typeSpeed: text.length < 70 ? 50 : 1,
      backSpeed: 30,
      smartBackspace: true,
      backDelay: 80,
      onComplete: (self) => {
        self.cursor.remove();
        this.isTyping = false;
      },
    });
  }

  swapWords(text) {
    const wordsArray = text.split(" ");
    const lastIndex = wordsArray.length - 1;
    const tmpWord = wordsArray[lastIndex];
    wordsArray[lastIndex] = wordsArray[lastIndex - 1];
    wordsArray[lastIndex - 1] = tmpWord;

    return wordsArray.join(" ");
  }

  getAuthorQuotes(input, output) {
    const author = input.value.trim().replace(/[^\w\s]/gi, "");

    this.showElement(this.searchLoader, "search__loader--show");

    if (this.shouldSearchUpdate(author)) {
      if (author.length > 2) {
        this.getQuotesFromDb(author, output);
      } else {
        output.innerHTML = `<h4 class="search-results__header">The author name should have at least 3 characters.</h4>`;
        this.showElement(this.searchContainer, "search-results--show");
        this.animateElement(this.searchContainer, "search-results--animate");
        this.hideElement(this.searchLoader, "search__loader--show");
        this.lastSearchInput = author;
      }
    } else {
      this.showElement(this.searchContainer, "search-results--show");
      this.animateElement(this.searchContainer, "search-results--animate");
      this.hideElement(this.searchLoader, "search__loader--show");
    }
  }

  getQuotesFromDb(input, output) {
    this.API.getAuthorQuotes(input)
      .then((response) => {
        let outputHTML = `<h4 class="search-results__header">Quotes by authors containing "${input}":</h4>`;
        if (response.length) {
          for (let quoteObj of response) {
            outputHTML += `<li class="search-results__item" title="Show on the big screen" role="button" tabindex="0" aria-label="show quote">${quoteObj.quote} <br>~ ${quoteObj.author}</li>`;
            this.showElement(
              this.showAddFormBtn,
              "search-results__add-btn--show"
            );
          }
        } else {
          outputHTML = `
            <h4 class="search-results__header">
              We're sorry. No quotes by this author.<br>Do you want to add one?
            </h4>`;
          this.showElement(
            this.showAddFormBtn,
            "search-results__add-btn--show"
          );
        }
        return outputHTML;
      })
      .then((quoteList) => {
        output.innerHTML = quoteList;
        this.showElement(this.searchContainer, "search-results--show");
        this.animateElement(this.searchContainer, "search-results--animate");
        this.hideElement(this.autocompleteList, "autocomplete__items--show");
        this.hideElement(this.searchLoader, "search__loader--show");
        this.lastSearchInput = author;
        this.autocompleteList.innerHTML = "";
      })
      .catch((err) => {
        output.innerHTML = `<h4 class="search-results__header">Failed to fetch author. <br>Try again later.</h4>`;
        this.showElement(this.searchContainer, "search-results--show");
        this.animateElement(this.searchContainer, "search-results--animate");
        this.hideElement(this.searchLoader, "search__loader--show");
        console.error(err);
      });
  }

  shouldSearchUpdate(input) {
    return input !== this.lastSearchInput;
  }

  showElement(element, className) {
    element.classList.add(className);
  }

  hideElement(element, className) {
    element.classList.remove(className);
  }

  animateElement(element, className) {
    element.classList.add(className);
  }

  displayCurrentYear(element) {
    const currentYear = new Date().getFullYear();
    element.textContent = currentYear;
  }
}

export default App;
