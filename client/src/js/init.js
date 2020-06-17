import App from "./js/App";
import selectors from "./js/DOM";

export default function init() {
  const pageLoader = document.getElementById("page-loader");
  pageLoader.classList.add("loaded");
  setTimeout(() => (pageLoader.style.display = "none"), 800);

  const QuoteApp = new App(selectors);
  QuoteApp.initializeApp();
}