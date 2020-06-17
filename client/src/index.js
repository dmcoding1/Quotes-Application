import init from "./js/init";

import "./styles/font.scss";
import "./styles/reset.scss";
import "./styles/loader.scss";
import "./styles/main.scss";
import "./styles/animations.scss";
import "./styles/viewports.scss";

window.addEventListener("load", init);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
