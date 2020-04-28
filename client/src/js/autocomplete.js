const authorInput = document.querySelector(".search__input");
const quotesList = document.querySelector(".search-results__list");
const addForm = document.querySelector(".add-quote");


export default function handleAutocomplete(e, value, autocompleteList, App) {
  const controller = new AbortController();
  const { signal } = controller;

  setTimeout(() => controller.abort(), 2000);
  
  if (value.length < 1) {
    autocompleteList.innerHTML = "";
    return;
  } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    return;
  } else {
    autocompleteList.innerHTML = "";  

    App.API.getAuthorQuotes(value, {signal})
      .then((quotes) => {
        let authors = quotes.map((quote) => quote.author);

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
          if (e.key === "ArrowUp" && focusCounter > 0) {
            focusCounter--;
            btns[focusCounter - 1].focus();
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
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            App.hideElement(addForm, "add-quote--show");
            authorInput.value = e.target.textContent;
            App.hideElement(autocompleteList, "autocomplete__items--show");
            App.getAuthorQuotes(authorInput, quotesList);
            autocompleteList.innerHTML = "";
          });
        });
      })
      .catch((err) => {
        if(err.name === "AbortError") return;
        console.error(err);
      });
  }
}