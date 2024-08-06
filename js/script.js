// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || { todo: [], inProgress: [], done: [] };
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;

}

// Todo: create a function to create a task card
function createTaskCard(task) {
    return `
      <div class="card mb-3" data-id="${task.id}">
            <div class="card-body">
                <h5 class="card-title">${task.name}</h5>
                <button class="btn btn-danger btn-sm delete" data-id="${task.id}">Delete</button>
            </div>
        </div>`;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    taskList.todo.forEach(task => $('#todo-cards').append(createTaskCard(task)));
    taskList.inProgress.forEach(task => $('#in-progress-cards').append(createTaskCard(task)));
    taskList.done.forEach(task => $('#done-cards').append(createTaskCard(task)));

    $('.card').draggable({
        revert: "invalid",
        stack: ".card"
    });
}



// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const taskName = $('#task-name').val();
    if (taskName) {
        const newTask = {
            id: generateTaskId(),
            name: taskName,
            status: 'todo'
        };
        taskList.todo.push(newTask);
        saveToLocalStorage();
        renderTaskList();
        $('#task-name').val('');
        $('#addTaskModal').modal('hide');
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
        const taskId = $(event.target).data('id');
        ['todo', 'inProgress', 'done'].forEach(status => {
            taskList[status] = taskList[status].filter(task => task.id !== taskId);
        });
        saveToLocalStorage();
        renderTaskList();
    }


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = $(ui.draggable).data('id');
    const newStatus = $(this).attr('id').split('-')[0];
    let task;

    ['todo', 'inProgress', 'done'].forEach(status => {
        taskList[status] = taskList[status].filter(t => {
            if (t.id === taskId) {
                task = t;
                return false;
            }
            return true;
        });
    });

    task.status = newStatus;
    taskList[newStatus].push(task);
    saveToLocalStorage();
    renderTaskList();
}

function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $('#task-form').submit(handleAddTask);
    $(document).on('click', '.delete', handleDeleteTask);

    $('.lane .card-body').droppable({
        accept: '.card',
            drop: handleDrop
        });

});