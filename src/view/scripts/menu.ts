import GeneralHeader from "../components/generalHeader.js";

document.addEventListener("DOMContentLoaded", () => {
  const header = new GeneralHeader();
  header.render();
  document.body.appendChild(header.container);
});
