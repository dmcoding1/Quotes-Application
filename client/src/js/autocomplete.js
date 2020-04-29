import * as DOM from "./DOM";

const { authorInput, quotesList, autocompleteList } = DOM.searchQuote;
const { addForm } = DOM.addQuote;

export default function handleAutocomplete(e, App) {
  const controller = new AbortController();
  const { signal } = controller;

  setTimeout(() => controller.abort(), 1000);

  const value = e.target.value;
  
  if (value.length < 3) {
    autocompleteList.innerHTML = "";
    return;
  } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    return;
  } else { 
    App.API.getAuthorQuotes(value, {signal})
      .then((quotes) => {
        const authors = quotes.map((quote) => quote.author);

        return [...new Set(authors)].map((author) => {
          return `<li class="autocomplete__item"><button class="autocomplete__btn">${author}</button></li>`;
        });
      })
      .then((authors) => {
        autocompleteList.innerHTML = authors.join("");
        App.showElement(autocompleteList, "autocomplete__items--show");
        return {};
      })
      .then((res) => {
        if (!value) {
          autocompleteList.innerHTML = "";
          return;
        }
        const btns = [
          ...autocompleteList.getElementsByClassName("autocomplete__btn"),
        ];

        let focusCounter = 0;
        
        document.addEventListener("keyup", (e) => {
          if (e.key === "ArrowUp") {
            if (focusCounter <= 1) {
              focusCounter = 0;
              authorInput.focus();
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
              App.getAuthorQuotes(authorInput, quotesList);
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

        function handleSelect(e) {
          authorInput.value = e.target.textContent;                        
          App.hideElement(addForm, "add-quote--show");  
          focusCounter = 0;          
          App.getAuthorQuotes(authorInput, quotesList);
        }

      })
      .catch((err) => {
        if(err.name === "AbortError") return;
        console.error(err);
      });

  }
}