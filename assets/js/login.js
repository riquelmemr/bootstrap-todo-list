const form = document.querySelector("#form-signin");
const alerts = document.querySelector("#alerts");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const account = getAccount(email);
  const validate = haveAnAccount(account, password);

  if (validate) {
    saveAccountInSession(email);
    window.location.href = "home.html";
  }
});

function haveAnAccount(account, password) {
  if (!account) {
    return showAlert(
      "danger",
      "Ops! Verifique sua senha ou email e tente novamente."
    );
  }

  if (account) {
    if (account.password != password) {
      return showAlert(
        "danger",
        "Ops! Sua senha está errada, tente novamente."
      );
    }
  }

  return true;
}

function getAccount(email) {
  const account = localStorage.getItem(email);
  if (account) return JSON.parse(account);

  return "";
}

function saveAccountInSession(email) {
  sessionStorage.setItem("logged", email);
}

function showAlert(mode, message) {
  alerts.innerHTML = "";

  const divToast = document.createElement("div");
  divToast.setAttribute("role", "alert");
  divToast.setAttribute("aria-live", "assertive");
  divToast.setAttribute("aria-atomic", "true");
  divToast.setAttribute("class", `toast bg-${mode} show`);
  alerts.appendChild(divToast);

  const toastHeader = document.createElement("div");
  toastHeader.classList.add("toast-header");
  divToast.appendChild(toastHeader);

  const strong = document.createElement("strong");
  strong.classList.add("me-auto");
  strong.innerText = "Alerta";
  toastHeader.appendChild(strong);

  const small = document.createElement("small");
  small.classList.add("text-muted");
  small.innerText = "agora mesmo";
  toastHeader.appendChild(small);

  const btnClose = document.createElement("button");
  btnClose.classList.add("btn-close");
  btnClose.setAttribute("type", "button");
  btnClose.setAttribute("btn-close", "toast");
  btnClose.setAttribute("aria-label", "Close");
  btnClose.setAttribute("data-bs-dismiss", "toast");
  toastHeader.appendChild(btnClose);

  const toastBody = document.createElement("div");
  toastBody.classList.add("toast-body");
  toastBody.innerText = message;
  divToast.appendChild(toastBody);
}
