class App {
  
  constructor(quoteNodeElem = null) {
    if (!quoteNodeElem) {
      throw new Error("HTML element not provided");
    }

    this.quoteNode = quoteNodeElem;

    this.API = {
      getRandomQuote: () => fetch("http://localhost:3000/random").then(res => res.json())
    };
  }

  showRandomQuote() {
    this.API.getRandomQuote()
      .then(response => {
        console.log(response);
        this.quoteNode.textContent = response.quote;

      }).catch(err => console.error(err));
  }

}

export default App;