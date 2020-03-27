class TaskUIProcessor {
    redraw(tasks, reverse) {
        let todoTasks = this.orderTasks(tasks.filter(t => t.status == TaskStatuses.ToDo), reverse);
        let completed = this.orderTasks(tasks.filter(t => t.status == TaskStatuses.Completed), reverse);

        this.updateCounters(todoTasks.length, completed.length);

        this.showTaskGroup('currentTasks', todoTasks, true);
        this.showTaskGroup('completedTasks', completed, false);
    }

    updateCounters(todoCount, completedCount) {
        document.getElementById('todoCount').innerHTML = `(${todoCount})`;
        document.getElementById('completedCount').innerHTML = `(${completedCount})`;
    }

    showTaskGroup(taskGroupId, groupTasks, isEditable) {
        let todo = document.getElementById(taskGroupId);
        if (todo) {

            while (todo.firstChild) {
                todo.removeChild(todo.lastChild);
            }

            groupTasks.forEach(task => {
                var itemLi = document.createElement("li");
                itemLi.className = 'list-group-item d-flex w-100 mb-2';
                itemLi.innerHTML = this.renderTaskTemplate(task, isEditable);
                if (task.color) {
                    itemLi.setAttribute("style", `background-color: ${task.color};`);
                }
                todo.appendChild(itemLi);
            });
        }
    }

    renderTaskTemplate(task, isEditable) {

        let editMenu = isEditable ?
            `<button type="button" class="btn btn-success w-100" onclick='context.eventHandler.completeTask(${task.id})'>Complete</button>
            <button type="button" class="btn btn-info w-100 my-2" onclick='context.eventHandler.showEditPopup(${task.id})'>Edit</button>` :
            '';

        return `<div class="w-100 mr-2">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${task.title}</h5>
                        <div>
                            <small class="mr-2">${task.priority} priority</small>
                            <small>${task.creationTime}</small>
                        </div>
                    </div>
                    <p class="mb-1 w-100">${task.text}</p>
                </div>
                <div class="dropdown m-2 dropleft">
                    <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-v" aria-hidden="true"></i>
                    </button>
                    <div class="dropdown-menu p-2 flex-column" aria-labelledby="dropdownMenuItem1">
                        ${editMenu}
                        <button type="button" class="btn btn-danger w-100" onclick='context.eventHandler.deleteTask(${task.id})'>Delete</button>
                    </div>
                </div>`;
    }


    orderTasks(tasks, reverse) {
        return reverse ?
            tasks.sort((t1, t2) => t2.utcTimestamp - t1.utcTimestamp) :
            tasks.sort((t1, t2) => t1.utcTimestamp - t2.utcTimestamp);
    }

    getTaskFromPopup() {
        let modal = document.getElementById('exampleModal');

        let priorityElement = [...document.getElementsByClassName('form-check-input')]
            .find(pe => pe.checked);

        let task = {
            title: document.getElementById('inputTitle').value,
            text: document.getElementById('inputText').value,
            priority: priorityElement.value,
            isEditMode: modal.dataset.editMode === 'true'
        };

        let color = document.getElementById('inputColor').value;
        if (this.isColor(color)) {
            task.color = color;
        }

        if (task.isEditMode) {
            task.id = modal.dataset.editingTaskId;
            modal.dataset.editMode = false;
        }

        return task;
    }

    isColor(strColor) {
        var s = new Option().style;
        s.color = strColor;
        return s.color == strColor;
    }

    showEditPopup(task) {
        let modal = document.getElementById('exampleModal');
        modal.dataset.editMode = true;
        modal.dataset.editingTaskId = task.id;
        document.getElementById('exampleModalLabel').innerHTML = 'Edit task';
        document.getElementById('saveButton').innerHTML = 'Save task';

        document.getElementById('inputTitle').value = task.title;
        document.getElementById('inputText').value = task.text;


        let priorityElements = [...document.getElementsByClassName('form-check-input')];
        priorityElements.forEach(pe => pe.checked = false);
        priorityElements.find(pe => pe.id == task.priority).checked = true;

        var clickEvent = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": false
        });

        var element = document.getElementById('addTaskBtn');
        element.dispatchEvent(clickEvent);
    }

    applyTheme(themeName) {

        if (themeName) {
            localStorage['theme'] = themeName;
        }
        else {
            themeName = localStorage['theme'] ?? 'light';
            let priorityElements = [...document.getElementsByClassName('theme-check-input')];
            priorityElements.forEach(pe => pe.checked = false);
            priorityElements.find(pe => pe.id == themeName).checked = true;
        }

        let bodyElem = document.querySelector('.wrapper');
        bodyElem.classList.remove('light');
        bodyElem.classList.remove('dark');
        bodyElem.classList.add(themeName);

    }
}