class EventHandler
{
    taskService;
    uiEngine;

    constructor(taskService, uiEngine){
        this.taskService = taskService;
        this.uiEngine = uiEngine;
    }
        
    saveTask() {
        let task = this.uiEngine.getTaskFromPopup();
    
        task.isEditMode ?
            this.taskService.update(task):
            this.taskService.add(task);
        
        this.updateUI()
    }
    
    deleteTask(id) {
        let task = { id };
        this.taskService.delete(task);
        this.updateUI()
    }
    
    completeTask(id) {
        let task = { id, status: TaskStatuses.Completed };
        this.taskService.update(task);
        this.updateUI()
    }

    showEditPopup(id) {
        let task = this.taskService.get(id);
        this.uiEngine.showEditPopup(task);
    }

    applyTheme(themeName){
        this.uiEngine.applyTheme(themeName);
    }

    orderTasks(reverse){
        context.isReverseOrder = reverse;
        this.updateUI();
    }

    saveTasks(){
        this.taskService.saveTasks();
    }

    updateUI(reverse){
        if(reverse == undefined){
            reverse = context.isReverseOrder;
        }

        let actualTasks = this.taskService.getList();
        this.uiEngine.redraw(actualTasks, reverse);
    }
}