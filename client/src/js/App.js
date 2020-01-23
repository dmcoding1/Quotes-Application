const Typed = require("typed.js");

class App {
  
  constructor(options = {}) {
    if (!options.quoteNode) {
      throw new Error("HTML element not provided");
    }

    this.quoteNode = options.quoteNode;
    this.loaderNode = options.loaderNode;
    console.log(options);

    this.API = {
      getRandomQuote: () => fetch("http://localhost:3000/random").then(res => res.json())
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
      }).catch(err => console.error(err));
  }

  animateText(text = "") {
    const randomMistakesCount = Math.floor((Math.random() * (5 - 2)) + 2);
    const splittedText = text.split('');
    const textLength = splittedText.length;
    const textToAnimate = [];
    let prevText = "";

    for (let i = 0; i < randomMistakesCount; i++) {
      const range = textLength / randomMistakesCount;
      prevText += splittedText.slice( (i * range), (i * range) + range).join('');
      textToAnimate.push( i === randomMistakesCount - 1 || i === 0 ? prevText : this.swapWords(prevText) );
    }

    console.log(textToAnimate);

    new Typed(`#${this.quoteNode.id}`, {
      strings: textToAnimate,
      typeSpeed: 10,
      backSpeed: 5,
      smartBackspace: true,
      backDelay: 100
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

}

export default App;