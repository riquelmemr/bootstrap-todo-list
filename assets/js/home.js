// Elements
const form = document.querySelector("#form-new-task");
const formUpdate = document.querySelector("#form-update");
const alerts = document.querySelector("#alerts");
const tasks = document.querySelector(".tasks");
const newTitle = document.querySelector("#new-title");
const newDescription = document.querySelector("#new-description");
const btnConfirm = document.querySelector(".btn-confirmation");

// Modal
const modal = new bootstrap.Modal("#add-modal");
const modalUpdate = new bootstrap.Modal("#edit-modal");
const modalConfirm = new bootstrap.Modal("#confirm-modal");

// User Data
const logged = sessionStorage.getItem("logged");
const dataUser = validateLogin();

document.querySelector(".btn-logout").addEventListener("click", logout);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#title");
  const description = document.querySelector("#description");
  const validate = validateTask(title.value, description.value);

  if (validate) {
    const task = {
      id: generateID(),
      title: title.value,
      description: description.value,
    };

    dataUser.tasks.push(task);
    saveDataUser(dataUser);
    createTask(task);

    title.value = "";
    description.value = "";
    modal.hide();
    showAlert("success", "Recado adicionado com sucesso!");
  }
});

formUpdate.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = Number(
    document.querySelector("#id-task-update").innerHTML.replace("#", "")
  );
  const title = newTitle.value;
  const description = newDescription.value;
  const indexTask = dataUser.tasks.findIndex((task) => task.id === id);
  const validate = validateTask(title, description);

  if (validate) {
    const task = {
      id: id,
      title: title,
      description: description,
    };

    dataUser.tasks.splice(indexTask, 1, task);
    saveDataUser(dataUser);
    getTasksOfUser(dataUser);
    modalUpdate.hide();
    showAlert("success", "Recado atualizado com sucesso!");
  }
});

function validateTask(title, description) {
  if (!title) {
    showAlert("danger", "Título é obrigatório.");
    return;
  }

  if (!description) {
    showAlert("danger", "Escreva uma descrição a seu recado.");
    return;
  }

  return true;
}

function validateLogin() {
  const dataUser = localStorage.getItem(logged) || false;

  if (!dataUser) {
    window.location.href = "index.html";
    sessionStorage.removeItem("logged");
    return;
  }

  const data = JSON.parse(dataUser);
  getTasksOfUser(data);

  return data;
}

function getTasksOfUser(dataUser) {
  tasks.innerHTML = "";
  const userTasks = dataUser.tasks;

  if (userTasks.length === 0) {
    tasks.innerHTML = `<p class="text-center">Você ainda não adicionou nenhum recado.</p>`;
    return;
  }

  for (const task of userTasks) {
    createTask(task);
  }
}

function generateID() {
  return new Date().getTime();
}

function saveDataUser(dataUser) {
  localStorage.setItem(dataUser.email, JSON.stringify(dataUser));
}

function logout() {
  sessionStorage.removeItem("logged");
  window.location.href = "index.html";
}

function updateTask(id) {
  const idTaskUpdate = document.querySelector("#id-task-update");
  const task = dataUser.tasks.find((task) => task.id === id);

  idTaskUpdate.textContent = `#${id}`;
  newTitle.value = task.title;
  newDescription.value = task.description;
}

function deleteTask(id) {
  modalConfirm.hide();
  const colTask = document.getElementById(id);
  const index = dataUser.tasks.findIndex((task) => task.id === id);

  colTask.classList.add("card-animation");
  dataUser.tasks.splice(index, 1);
  saveDataUser(dataUser);

  setTimeout(() => {
    getTasksOfUser(dataUser);
  }, 1900);

  showAlert("danger", "Recado excluído com sucesso!");
}

function createTask(task) {
  Array.from(tasks.children).forEach((child) => {
    if (child.tagName === "P") {
      child.remove();
    }
  });

  const col = document.createElement("div");
  col.id = task.id;
  col.classList.add("col-12", "col-sm-12", "col-lg-4", "col-xl-3");
  tasks.appendChild(col);

  const card = document.createElement("div");
  card.classList.add("card", "clean-gray");
  col.appendChild(card);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "position-relative");
  card.appendChild(cardBody);

  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = task.title;
  cardBody.appendChild(cardTitle);

  const hr = document.createElement("hr");
  cardBody.appendChild(hr);

  const cardDescription = document.createElement("p");
  cardDescription.classList.add("card-text");
  cardDescription.textContent = task.description;
  cardBody.appendChild(cardDescription);

  const btns = document.createElement("div");
  btns.classList.add("btns");
  cardBody.appendChild(btns);

  const btnEdit = document.createElement("i");
  btnEdit.id = "update-task";
  btnEdit.classList.add(
    "bi",
    "bi-pencil",
    "btn-edit",
    "rounded-2",
    "text-white",
    "me-2"
  );
  btnEdit.setAttribute("onclick", "updateTask(" + task.id + ")");
  btns.appendChild(btnEdit);

  const btnDelete = document.createElement("i");
  btnDelete.id = "delete-task";
  btnEdit.setAttribute("data-bs-toggle", "modal");
  btnEdit.setAttribute("data-bs-target", "#edit-modal");
  btnDelete.classList.add(
    "bi",
    "bi-trash3-fill",
    "btn-delete",
    "rounded-2",
    "text-white"
  );
  btnDelete.addEventListener("click", () => {
    showConfirmation("Tem certeza que deseja excluir este recado?", task.id);
    btnConfirm.setAttribute("onclick", `deleteTask(${task.id})`);
  });
  btns.appendChild(btnDelete);

  const idParagraph = document.createElement("p");
  idParagraph.id = "id-task";
  idParagraph.textContent = `#${task.id}`;
  idParagraph.classList.add("position-absolute", "font-12");
  cardBody.appendChild(idParagraph);
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
  }, 2000);
}

function showConfirmation(message, id) {
  const body = document.querySelector(".body-confirmation");
  body.innerHTML = message + " #" + id;
  modalConfirm.show();
}
