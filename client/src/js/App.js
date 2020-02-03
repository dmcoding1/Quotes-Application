const Typed = require("typed.js");

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
    this.lastSearchInput = false;

    this.API = {
      getRandomQuote: () =>
        fetch("http://localhost:3000/random").then(res => res.json()),
      getAuthorQuotes: author =>
        fetch(`http://localhost:3000/quotes?author=${author}`).then(res =>
          res.json()
        ),
      postQuote: quoteObj => {
        fetch("http://localhost:3000/quotes/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(quoteObj)
        })
          .then(response => response.text())
          .then(res => console.log(res))
          .catch(err => console.log(err));
      }
    };
  }

  showRandomQuote() {
    this.quoteNode.textContent = "";
    this.authorNode.textContent = "";
    this.showLoader();
    this.API.getRandomQuote()
      .then(response => {
        this.hideLoader();
        this.animateText(response.quote);
        this.authorNode.textContent = `~ ${response.author}`;
      })
      .catch(err => console.error(err));
  }

  animateText(text = "") {
    const randomMistakesCount = Math.floor(Math.random() * (5 - 3) + 3);
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
      strings: textToAnimate,
      typeSpeed: 1,
      backSpeed: 20,
      smartBackspace: true,
      backDelay: 80,
      onComplete: self => {
        self.cursor.remove();
      }
    });
  }

  showLoader() {
    if (this.loaderNode) {
      this.loaderNode.classList.add("quote__loader--show");
    } else if (this.authorNode) {
      this.authorNode.classList.add("quote__author--hide");
    }
  }

  hideLoader() {
    if (this.loaderNode) {
      this.loaderNode.classList.remove("quote__loader--show");
    } else if (this.authorNode) {
      this.authorNode.classList.remove("quote__author--hide");
    }
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
    const author = input.value.trim().replace(/\?|\*|\#|\$/g, '');
    this.showSearchLoader(this.searchLoader);
    if (this.shouldSearchUpdate(author)) {
      if (author.length > 2) {
        this.getQuotesFromDb(author, output);
      } else {
        output.innerHTML = `<h4 class="search-results__header">The author name should have at least 3 characters.</h4>`;
        this.showSearchResults(this.searchContainer);
        this.animateSearchResults(this.searchContainer);
        this.hideSearchLoader(this.searchLoader);
        this.lastSearchInput = author;
      }
    } else {
      this.showSearchResults(this.searchContainer);
      this.animateSearchResults(this.searchContainer);
      this.hideSearchLoader(this.searchLoader);
    }
  }

  getQuotesFromDb(input, output) {
    this.API.getAuthorQuotes(input)
      .then(response => {
        let outputHTML = `<h4 class="search-results__header">Quotes by authors containing "${input}":</h4>`;
        if (response.length) {
          for (let quoteObj of response) {
            outputHTML += `<li class="search-results__item">${quoteObj.quote} <br>~ ${quoteObj.author}</li>`;
          }
        } else {
          outputHTML = `
            <h4 class="search-results__header">
              We're sorry. No quotes by this author.<br>Do you want to add one?
            </h4>`;
          this.showAddFormBtn.classList.add("search-results__add-btn--show");
        }
        return outputHTML;
      })
      .then(quoteList => {
        output.innerHTML = quoteList;
        this.showSearchResults(this.searchContainer);
        this.animateSearchResults(this.searchContainer);
        this.hideSearchLoader(this.searchLoader);
        this.lastSearchInput = author;
      })
      .catch(err => {
        output.innerHTML = `<h4 class="search-results__header">Failed to fetch author. <br>Try again later.</h4>`;
        this.showSearchResults(this.searchContainer);
        this.animateSearchResults(this.searchContainer);
        this.hideSearchLoader(this.searchLoader);
      });
  }

  shouldSearchUpdate(input) {
    return input !== this.lastSearchInput;
  }

  showSearchLoader(loader) {
    loader.classList.add("search__loader--show");
  }

  hideSearchLoader(loader) {
    loader.classList.remove("search__loader--show");
  }

  showSearchResults(container) {
    container.classList.add("search-results--show");
  }

  animateSearchResults(container) {
    container.classList.add("search-results--animate");
  }

  showAddForm(form) {
    form.classList.add("add-quote--show");
    form.classList.add("add-quote--animate");
  }

  hideAddForm(form) {
    form.classList.remove("add-quote--show");
  }
}

export default App;
