const elements = {
  siteName: document.getElementById("bookmarkName"),
  siteURL: document.getElementById("bookmarkURL"),
  submitBtn: document.getElementById("submitBtn"),
  tableContent: document.getElementById("tableContent"),
  closeBtn: document.getElementById("closeBtn"),
  boxModal: document.querySelector(".box-info"),
};

let bookmarks = JSON.parse(localStorage.getItem("bookmarksList")) || [];

elements.submitBtn.addEventListener("click", () => {
  const validInput = (input) => input.classList.contains("is-valid");
  if (validInput(elements.siteName) && validInput(elements.siteURL)) {
    const bookmark = {
      siteName: elements.siteName.value.trim(),
      siteURL: elements.siteURL.value.trim(),
    };
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    displayBookmark(bookmarks.length - 1);
    [elements.siteName, elements.siteURL].forEach((input) =>
      input.classList.remove("is-valid")
    );
  } else {
    elements.boxModal.classList.remove("d-none");
  }
});

function displayBookmark(index) {
  const { siteName, siteURL } = bookmarks[index];
  const fixedURL = siteURL.replace(/^https?:\/\//, "");
  const newBookmark = `<tr><td>${
    index + 1
  }</td><td>${siteName}</td><td><button class="btn btn-visit" data-index="${index}"><i class="fa-solid fa-eye pe-2"></i>Visit</button></td><td><button class="btn btn-delete pe-2" data-index="${index}"><i class="fa-solid fa-trash-can"></i>Delete</button></td></tr>`;
  elements.tableContent.insertAdjacentHTML("beforeend", newBookmark);
  document
    .querySelectorAll(".btn-delete, .btn-visit")
    .forEach((btn) => btn.addEventListener("click", handleButtonClick));
}

function handleButtonClick(e) {
  const index = e.target.dataset.index;
  if (e.target.classList.contains("btn-delete")) {
    bookmarks.splice(index, 1);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    elements.tableContent.innerHTML = "";
    bookmarks.forEach((_, index) => displayBookmark(index));
  } else if (e.target.classList.contains("btn-visit")) {
    const { siteURL } = bookmarks[index];
    open(siteURL.startsWith("http") ? siteURL : `https://${siteURL}`);
  }
}

[elements.siteName, elements.siteURL].forEach((input) =>
  input.addEventListener("input", () => validate(input))
);
elements.closeBtn.addEventListener("click", () =>
  elements.boxModal.classList.add("d-none")
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") elements.boxModal.classList.add("d-none");
});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("box-info"))
    elements.boxModal.classList.add("d-none");
});

function validate(input) {
  const isValid = (regex) => regex.test(input.value.trim());
  const nameRegex = /^\w{3,}(\s+\w+)*$/;
  const urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;
  input.classList.toggle(
    "is-valid",
    isValid(input === elements.siteName ? nameRegex : urlRegex)
  );
  input.classList.toggle(
    "is-invalid",
    !isValid(input === elements.siteName ? nameRegex : urlRegex)
  );
}
