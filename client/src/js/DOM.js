export const randomQuote = {
  quoteNode: document.getElementById("quote"),
  quoteLoaderNode: document.querySelector(".quote__loader"),
  searchLoaderNode: document.querySelector(".search__loader"),
  randomQuote: document.getElementById("random"),
  authorNode: document.getElementById("author"),
};

export const addQuote = {
  showAddFormBtn: document.querySelector(".search-results__add-btn"),
  addForm: document.querySelector(".add-quote"),
  addFormExitBtn: document.querySelector(".add-quote__btn-exit"),
  addFormLoader: document.querySelector(".add-quote__loader"),
  quoteAuthorInput: document.getElementById("quote-author"),
  quoteBodyInput: document.getElementById("quote-body"),
  addQuoteBtn: document.querySelector(".add-quote__btn"),
};

export const searchQuote = {
  searchContainer: document.querySelector(".search-results"),
  searchForm: document.querySelector(".search__form"),
  authorInput: document.querySelector(".search__input"),
  searchBtn: document.querySelector(".search__btn"),
  quotesList: document.querySelector(".search-results__list"),
  searchExitBtn: document.querySelector(".search-results__btn"),
  autocompleteList: document.querySelector(".autocomplete__items"),
};

