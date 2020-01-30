const Typed = require("typed.js");

class App {
  
  constructor(options = {}) {
    if (!options.quoteNode) {
      throw new Error("HTML element not provided");
    }

    this.quoteNode = options.quoteNode;
    this.loaderNode = options.loaderNode;
    this.authorNode = options.authorNode;
    this.searchContainer = options.searchContainer;
    this.lastSearchInput = false;

    this.API = {
      getRandomQuote: () => fetch("http://localhost:3000/random").then(res => res.json()),
      getAuthorQuotes: (author) => fetch(`http://localhost:3000/quotes?author=${author}`).then(res => res.json())
    };
  }


  showRandomQuote() {
    this.quoteNode.textContent = "";
    this.showLoder();
    this.API.getRandomQuote()
      .then(response => {
        this.hideLoder();
        // this.quoteNode.textContent = response.quote;
        this.animateText(response.quote);
        this.authorNode.textContent = `~ ${response.author}`;
      })
      .catch(err => console.error(err));
  }

  animateText(text = "") {
    const randomMistakesCount = Math.floor((Math.random() * (5 - 3)) + 3);
    const splittedText = text.split('');
    const textLength = splittedText.length;
    const textToAnimate = [];
    let prevText = "";

    for (let i = 0; i < randomMistakesCount; i++) {
      const range = textLength / randomMistakesCount;
      prevText += splittedText.slice( (i * range), (i * range) + range).join('');
      textToAnimate.push( i === randomMistakesCount - 1 || i === 0 ? prevText : this.swapWords(prevText) );
    }

    new Typed(`#${this.quoteNode.id}`, {
      strings: textToAnimate,
      typeSpeed: 1,
      backSpeed: 20,
      smartBackspace: true,
      backDelay: 80,
      onComplete: (self) => {
        self.cursor.remove();
      },
    });

  }

  showLoder() {
    if (this.loaderNode) {
      this.loaderNode.classList.add("show");
    }
  }

  hideLoder() {
    if (this.loaderNode) {
      this.loaderNode.classList.remove("show");
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
    const author = input.value;

    if (this.shouldSearchUpdate(author)) {
      if (author.length > 2) {
        this.API.getAuthorQuotes(author).then(response => {
          let outputHTML = `<h4 class="search-results__header">Quotes by authors containing "${author}":</h4>`;
          if (response.length) {
            for (let quoteObj of response) {
              outputHTML += `<li class="search-results__item">${quoteObj.quote} <br>~ ${quoteObj.author}</li>`;
            }
          } else {
            outputHTML = `<h4 class="search-results__header">We're sorry. No quotes by this author.<br>Do you want to add one?</h4>`;
          }
          return outputHTML;
        }).then(quoteList => {
          output.innerHTML = quoteList;
          this.searchContainer.classList.add("show");
          this.searchContainer.classList.add("animate");
          this.lastSearchInput = author;
        });
      } else {
        output.innerHTML = `<h4 class="search-results__header">The author name should have at least 3 characters.</h4>`;
        this.searchContainer.classList.add("show");
        this.searchContainer.classList.add("animate");
        this.lastSearchInput = author;
      }
    } else {
      this.searchContainer.classList.add("show");
      this.searchContainer.classList.add("animate");
    }
  }

  shouldSearchUpdate(input) {
    return input !== this.lastSearchInput;
  }

}

export default App;