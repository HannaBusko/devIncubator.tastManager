class TaskService{

    inMemoryTasks = [];
    localStorageKey = 'tasks';

    getList(){
        return this.inMemoryTasks;
    }

    get(id){
        return this.inMemoryTasks.find(t => t.id == id);
    }

    add(task){
        let currentDate = new Date();
        task.utcTimestamp = currentDate.getTime(),
        task.creationTime = currentDate.toUTCString()
        task.id = this.inMemoryTasks.length + 1;
        task.status = TaskStatuses.ToDo;
        this.inMemoryTasks.push(task);
    }

    delete(task){
        var removalIndex = this.inMemoryTasks.findIndex(t => t.id == task.id);
        this.inMemoryTasks.splice(removalIndex, 1);
    }

    update(task){
        var editableIndex = this.inMemoryTasks.findIndex(t => t.id == task.id);
        let existingItem = this.inMemoryTasks[editableIndex];
        this.inMemoryTasks[editableIndex] = {...existingItem, ...task};
    }

    saveTasks(){
        let serializedTasks = JSON.stringify(this.getList());
        localStorage[this.localStorageKey] = serializedTasks;
    }

    readFromStorage(){
        let serialized = localStorage[this.localStorageKey];
        this.inMemoryTasks = serialized? JSON.parse(serialized) : [];
    }
}

const TaskStatuses = {
    ToDo: 'todo',
    Completed: 'completed'
}
