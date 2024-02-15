const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box");

let editId,
  // Эта переменная проверяет изменяет ли юзер уже существующую задачку
  isEditTask = false,
  //   Создаём объект с данными с помощью локального хранилища браузера
  todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => {
  // Даём каждой кнопке фильтров событие клик
  btn.addEventListener("click", () => {
    // При клике на какую-либо кнопку убираем класс active и перемещаем на ту, на которую нажали
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");

    showTodo(btn.id);
  });
});

// Эта функция показывает задачи в зависимости от нажатой кнопки фильтраций задач
function showTodo(filter) {
  let liTag = "";

  if (todos) {
    todos.forEach((todo, id) => {
      // Эта переменная проверяет обозначена ли задача как выполненная
      let completed = todo.status == "completed" ? "checked" : "";

      //   Если кнопка фильтрации равна выбранному статусу задачи или если выбран статус "все"
      if (filter == todo.status || filter == "all") {
        // Отрисовываем задачку, ячейку статуса, и настройки задачки
        liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Изменить</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Удалить</li>
                                </ul>
                            </div>
                        </li>`;
      }
    });
  }

  //   Отображаем задачку
  taskBox.innerHTML =
    liTag || `<span class="noTasks">У вас пока что нет задач, добавьте!</span>`;

  let checkTask = taskBox.querySelectorAll(".task");

  //   Если нет задач, то делаем кнопку очистки недоступной
  !checkTask.length
    ? clearAll.classList.remove("active")
    : clearAll.classList.add("active");

  // Добавляем скроллбар если слишком много задач
  taskBox.offsetHeight >= 300
    ? taskBox.classList.add("overflow")
    : taskBox.classList.remove("overflow");
}

// По дефолту у нас всегда будет поставлен фильтр "Все"
showTodo("all");

// Показывает меню для работы с задачкой
function showMenu(selectedTask) {
  // Эта переменная ссылается на кнопки "удалить" и "изменить"
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");

  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}

// Эта функция определяет статус задачи, зачеркивает если выполнена и добавляет в колонку выполненных задач
function updateStatus(selectedTask) {
  // Эта переменная ссылается на текст
  let taskName = selectedTask.parentElement.lastElementChild;

  //   Если ячейка выбрана
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

// Эта функция редактирует задачу
function editTask(taskId, textName) {
  editId = taskId;
  // Включаем статус редактирования задачи
  isEditTask = true;
  //   Заменяем текст
  taskInput.value = textName;
  //   Подсвечиваем и фокусируем юзера на изменяемой задаче
  taskInput.focus();
  taskInput.classList.add("active");
}

// Эта функция удаляет задачу
function deleteTask(deleteId, filter) {
  // Выключаем статус редактирования задачи
  isEditTask = false;
  //   Удаляем выбранную задачу
  todos.splice(deleteId, 1);
  //   Обновляем хранилище после удаления задачи
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
}

// При нажатии на кнопку очищения:
clearAll.addEventListener("click", () => {
  // выключаем статус редактирования задачи
  isEditTask = false;
  //   Удаляем все задачи
  todos.splice(0, todos.length);
  //   Обновляем хранилище
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
});

// При использовании клавиши клавиатуры:
taskInput.addEventListener("keyup", (e) => {
  // Эта переменная убирает ненужные пробелы
  let userTask = taskInput.value.trim();

  //   Если юзер нажал на клавишу Enter и если юзер что-либо ввёл
  if (e.key == "Enter" && userTask) {
    // Если изменяют существующую задачку
    if (!isEditTask) {
      // Проверка на наличие задач
      todos = !todos ? [] : todos;
      //   Эта переменная собирает задачку. Даёт введёное имя и статус ожидания по умолчанию
      let taskInfo = { name: userTask, status: "pending" };
      //   добавляем в хранилище новую задачу
      todos.push(taskInfo);
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
    }

    // Очищаем инпут после успешного enter
    taskInput.value = "";
    // Добавляем в наше хранилище новую задачу
    localStorage.setItem("todo-list", JSON.stringify(todos));
    // Динамически отображаем новую задачу
    showTodo(document.querySelector("span.active").id);
  }
});
