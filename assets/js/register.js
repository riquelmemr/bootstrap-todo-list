const form = document.querySelector("#form-signup");
const alerts = document.querySelector("#alerts");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#confirm-password").value;
  const validate = validateAccount(email, password, confirmPassword);

  if (validate) {
    saveAccount({
      email: email,
      password: password,
      tasks: [],
    });

    showAlert(
      "success",
      "Sua conta foi criada com sucesso! \n Você será redirecionado em 2s."
    );
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  }
});

function validateAccount(email, password, confirmPassword) {
  const alreadyHaveAnAccount = localStorage.getItem(email);

  if (alreadyHaveAnAccount) {
    showAlert("danger", "E-mail já utilizado. Tente um outro e-mail.");
    return;
  }

  if (email < 5) {
    showAlert("danger", "Preencha o campo com um e-mail válido.");
    return;
  }

  if (password.length < 6) {
    showAlert("danger", "Crie um senha com no mínimo 6 dígitos.");
    return;
  }

  if (password !== confirmPassword) {
    showAlert("danger", "Suas senhas devem ser iguais!");
    return;
  }

  return true;
}

function saveAccount(user) {
  localStorage.setItem(user.email, JSON.stringify(user));
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

  setTimeout(() => {
    alerts.innerHTML = "";
  }, 3000);
}
