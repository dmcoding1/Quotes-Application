const Typed = require("typed.js");

const URL = process.env.HOST_URL;

class App {
  constructor(UISelectors) {
    this.API = {
      getAuthorQuotes: (author, options = {}) =>
        fetch(`${URL}/quotes?author=${author}`, options).then((res) =>
          res.json()
        ),
      getRandomQuote: () => fetch(`${URL}/random`).then((res) => res.json()),
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

    this.DOMNodes = {
      addForm: document.querySelector(UISelectors.ADD_FORM_QUERY),
      addFormExitBtn: document.querySelector(
        UISelectors.ADD_FORM_EXIT_BTN_QUERY
      ),
      addFormLoader: document.querySelector(UISelectors.ADD_FORM_LOADER_QUERY),
      addQuoteBtn: document.querySelector(UISelectors.ADD_QUOTE_BTN_QUERY),
      authorInput: document.querySelector(UISelectors.AUTHOR_INPUT_QUERY),
      authorNode: document.getElementById(UISelectors.AUTHOR_ID),
      autocompleteList: document.querySelector(
        UISelectors.AUTOCOMPLETE_LIST_QUERY
      ),
      quoteAuthorInput: document.getElementById(
        UISelectors.QUOTE_AUTHOR_INPUT_ID
      ),
      quoteBodyInput: document.getElementById(UISelectors.QUOTE_BODY_INPUT_ID),
      quotesList: document.querySelector(UISelectors.QUOTES_LIST_QUERY),
      randomQuoteBtn: document.getElementById(UISelectors.RANDOM_QUOTE_BTN_ID),
      randomQuoteLoader: document.querySelector(
        UISelectors.RANDOM_QUOTE_LOADER_QUERY
      ),
      randomQuoteNode: document.getElementById(UISelectors.RANDOM_QUOTE_ID),
      searchBtn: document.querySelector(UISelectors.SEARCH_BTN_QUERY),
      searchContainer: document.querySelector(
        UISelectors.SEARCH_CONTAINER_QUERY
      ),
      searchExitBtn: document.querySelector(UISelectors.SEARCH_EXIT_BTN_QUERY),
      searchForm: document.querySelector(UISelectors.SEARCH_FORM_QUERY),
      searchLoader: document.querySelector(UISelectors.SEARCH_LOADER_QUERY),
      showAddFormBtn: document.querySelector(
        UISelectors.SHOW_ADD_FORM_BTN_QUERY
      ),
    };  

    this.lastSearchInput = null;
  }

  addEventListeners() {
    this.DOMNodes.randomQuoteBtn.addEventListener("click", () =>
      this.showRandomQuote()
    );
    this.DOMNodes.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    this.DOMNodes.searchBtn.addEventListener("click", (e) => {
      this.hideElement(this.DOMNodes.addForm, "add-quote--show");
      this.getAuthorQuotes(this.DOMNodes.authorInput, this.DOMNodes.quotesList);
      this.DOMNodes.autocompleteList.innerHTML = "";
    });
    this.DOMNodes.authorInput.addEventListener("input", (e) => {
      this.handleAutocomplete(e);
    });
    this.DOMNodes.searchExitBtn.addEventListener("click", () => {
      this.hideElement(this.DOMNodes.searchContainer, "search-results--show");
      this.hideElement(
        this.DOMNodes.showAddFormBtn,
        "search-results__add-btn--show"
      );
    });
    this.DOMNodes.showAddFormBtn.addEventListener("click", () => {
      this.DOMNodes.addFormLoader.textContent = "";
      this.DOMNodes.quoteBodyInput.value = "";
      this.DOMNodes.quoteAuthorInput.value = this.DOMNodes.authorInput.value;
      this.hideElement(this.DOMNodes.searchContainer, "search-results--show");
      this.showElement(this.DOMNodes.addForm, "add-quote--show");
      this.animateElement(this.DOMNodes.addForm, "add-quote--animate");
    });
    this.DOMNodes.addFormExitBtn.addEventListener("click", (e) => {
      this.hideElement(this.DOMNodes.addForm, "add-quote--show");
    });
    this.DOMNodes.addForm.addEventListener("submit", (e) => {
      this.postQuote(e);
    });

    this.DOMNodes.quoteBodyInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        this.postQuote(e);
      }
    });

    this.DOMNodes.quoteBodyInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        this.postQuote(e);
      }
    });

    this.DOMNodes.addForm.addEventListener("keyup", (e) => {
      e.preventDefault();
      if (e.key === "Escape") {
        this.hideElement(this.DOMNodes.addForm, "add-quote--show");
        this.DOMNodes.quoteBodyInput.value = "";
        this.DOMNodes.quoteBodyInput.value = "";
      }
    });

    this.DOMNodes.quotesList.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        this.DOMNodes.randomQuoteNode.textContent = "";
        this.hideElement(this.DOMNodes.searchContainer, "search-results--show");
        this.animateText(e.target.childNodes[0].wholeText);
        this.DOMNodes.authorNode.textContent = e.target.childNodes[2].wholeText;
      }
    });

    this.DOMNodes.quotesList.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && e.target.tagName === "LI") {
        this.DOMNodes.randomQuoteNode.textContent = "";
        this.hideElement(this.DOMNodes.searchContainer, "search-results--show");
        this.animateText(e.target.childNodes[0].wholeText);
        this.DOMNodes.authorNode.textContent = e.target.childNodes[2].wholeText;
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

      this.hideElement(this.DOMNodes.searchContainer, "search-results--show");
      this.hideElement(this.DOMNodes.addForm, "add-quote--show");
      this.DOMNodes.autocompleteList.innerHTML = "";
    });
  }

  animateElement(element, className) {
    element.classList.add(className);
  }

  animateText(text = "") {
    const maxMistakesCount = 3;
    const randomMistakesCount = Math.floor(Math.random() + maxMistakesCount);
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

    new Typed(`#${this.DOMNodes.randomQuoteNode.id}`, {
      strings: text.length > 70 ? [text] : textToAnimate,
      typeSpeed: text.length < 70 ? 50 : 1,
      backSpeed: 30,
      smartBackspace: true,
      backDelay: 80,
      onComplete: (self) => {
        self.cursor.remove();
        this.DOMNodes.randomQuoteBtn.removeAttribute("disabled");
      },
    });
  }

  displayCurrentYear(element) {
    const currentYear = new Date().getFullYear();
    element.textContent = currentYear;
  }

  getAuthorQuotes(input, output) {
    this.showElement(this.DOMNodes.searchLoader, "search__loader--show");
    const author = input.value.trim().replace(/[^\w\s]/gi, "");

    if (this.shouldSearchUpdate(author)) {
      if (author.length > 2) {
        this.getQuotesFromDb(author, output);
        this.lastSearchInput = author;
      } else {
        output.innerHTML = `<h4 class="search-results__header">The author name should have at least 3 characters.</h4>`;
        this.showSearchResults();
        this.lastSearchInput = author;
      }
    } else {
      this.showSearchResults();
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
              this.DOMNodes.showAddFormBtn,
              "search-results__add-btn--show"
            );
          }
        } else {
          outputHTML = `
            <h4 class="search-results__header">
              We're sorry. No quotes by this author.<br>Do you want to add one?
            </h4>`;
          this.showElement(
            this.DOMNodes.showAddFormBtn,
            "search-results__add-btn--show"
          );
        }
        return outputHTML;
      })
      .then((quoteList) => {
        output.innerHTML = quoteList;
        this.showSearchResults();
        this.hideElement(
          this.DOMNodes.autocompleteList,
          "autocomplete__items--show"
        );
        this.DOMNodes.autocompleteList.innerHTML = "";
      })
      .catch((err) => {
        output.innerHTML = `<h4 class="search-results__header">Failed to fetch author. <br>Try again later.</h4>`;
        this.showSearchResults();
        console.error(err);
      });
  }

  handleAutocomplete(e) {
    const controller = new AbortController();
    const { signal } = controller;

    setTimeout(() => controller.abort(), 1000);

    const value = e.target.value;

    if (value.length < 3) {
      this.DOMNodes.autocompleteList.innerHTML = "";
      return;
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      return;
    } else {
      this.API.getAuthorQuotes(value, { signal })
        .then((quotes) => {
          const authors = quotes.map((quote) => quote.author);

          return [...new Set(authors)].map((author) => {
            return `<li class="autocomplete__item"><button class="autocomplete__btn">${author}</button></li>`;
          });
        })
        .then((authors) => {
          this.DOMNodes.autocompleteList.innerHTML = authors.join("");
          this.showElement(
            this.DOMNodes.autocompleteList,
            "autocomplete__items--show"
          );
          return {};
        })
        .then((res) => {
          if (!value) {
            this.DOMNodes.autocompleteList.innerHTML = "";
            return;
          }
          
          this.handleSelectionFromAutocomplete();          
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          console.error(err);
        });
    }
  }

  handleSelectionFromAutocomplete() {
    const btns = [
      ...this.DOMNodes.autocompleteList.getElementsByClassName(
        "autocomplete__btn"
      ),
    ];          

    let focusCounter = 0;

    const handleSelect = (e) => {
      this.DOMNodes.authorInput.value = e.target.textContent;
      this.hideElement(this.DOMNodes.addForm, "add-quote--show");
      focusCounter = 0;
      this.getAuthorQuotes(
        this.DOMNodes.authorInput,
        this.DOMNodes.quotesList
      );
    };

    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowUp") {
        if (focusCounter <= 1) {
          focusCounter = 0;
          this.DOMNodes.authorInput.focus();
        } else {
          focusCounter--;
          btns[focusCounter - 1].focus();
        }
      } else if (
        e.key === "ArrowDown" &&
        focusCounter < btns.length &&
        focusCounter >= 0
      ) {
        focusCounter++;
        btns[focusCounter - 1].focus();
      }
    });

    btns.forEach((btn) => {
      btn.addEventListener("mouseup", (e) => {
        e.preventDefault();
        handleSelect(e);
      });
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (focusCounter === 0) {
          this.getAuthorQuotes(
            this.DOMNodes.authorInput,
            this.DOMNodes.quotesList
          );
          return;
        }
        handleSelect(e);
      });
      btn.addEventListener("keyup", (e) => {
        e.preventDefault();
        if (e.key === "Tab") focusCounter++;
        if (e.key === "Tab" && e.shiftKey) focusCounter--;
      });
    });
  }

  hideElement(element, className) {
    element.classList.remove(className);
  }

  initializeApp() {
    this.showRandomQuote();
    this.addEventListeners();
    this.displayCurrentYear(document.querySelector(".footer__date"));
  }

  postQuote(e) {
    e.preventDefault();

    this.DOMNodes.addFormLoader.textContent = "";
    this.hideElement(this.DOMNodes.addFormLoader, "add-quote__loader--message");
    this.showElement(this.DOMNodes.addQuoteBtn, "add-quote__btn--loading");

    const requestBody = {
      quote: this.DOMNodes.quoteBodyInput.value,
      author: this.DOMNodes.quoteAuthorInput.value,
      genre: "",
    };

    const { quote, author, genre} = requestBody;

    if (author.length < 3 || quote.length < 3) {
      this.showElement(
        this.DOMNodes.addFormLoader,
        "add-quote__loader--message"
      );
      this.DOMNodes.addFormLoader.textContent =
        "Author and quote must have at least 3 characters";
      return;
    } else if (quote.length > 400) {
      this.showElement(
        this.DOMNodes.addFormLoader,
        "add-quote__loader--message"
      );
      this.DOMNodes.addFormLoader.textContent = "The quote is too long";
      return;
    }

    this.API.getQuote(quote)
      .then((res) => {
        if (res.length) {
          this.showElement(
            this.DOMNodes.addFormLoader,
            "add-quote__loader--message"
          );
          this.DOMNodes.addFormLoader.textContent = `We already have this quote. Check ${res[0].author}`;
        } else {
          this.API.postQuote(requestBody);
          this.showElement(
            this.DOMNodes.addFormLoader,
            "add-quote__loader--message"
          );
          this.DOMNodes.addFormLoader.textContent = "Quote added";
          this.DOMNodes.quoteAuthorInput.value = "";
          this.DOMNodes.quoteBodyInput.value = "";
        }
      })
      .catch((err) => console.log(err));
  }

  showElement(element, className) {
    element.classList.add(className);
  }  

  showRandomQuote() {
    this.DOMNodes.randomQuoteBtn.setAttribute("disabled", "true");
    this.DOMNodes.randomQuoteNode.textContent = "";
    this.DOMNodes.authorNode.textContent = "";
    this.showElement(this.DOMNodes.randomQuoteLoader, "quote__loader--show");

    this.API.getRandomQuote()
      .then((response) => {
        this.hideElement(
          this.DOMNodes.randomQuoteLoader,
          "quote__loader--show"
        );
        this.animateText(response.quote);
        this.DOMNodes.authorNode.textContent = `~ ${response.author}`;
      })
      .catch((err) => {
        this.hideElement(
          this.DOMNodes.randomQuoteLoader,
          "quote__loader--show"
        );
        this.DOMNodes.randomQuoteNode.textContent =
          "Cannot connect to the server. Check your internet connection and try again.";
        this.DOMNodes.randomQuoteBtn.removeAttribute("disabled");
        console.error(err);
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

  shouldSearchUpdate(input) {
    return input !== this.lastSearchInput;
  }

  showSearchResults() {
    this.showElement(this.DOMNodes.searchContainer, "search-results--show");
    this.animateElement(
      this.DOMNodes.searchContainer,
      "search-results--animate"
    );
    this.hideElement(this.DOMNodes.searchLoader, "search__loader--show");
  }  
}

export default App;
